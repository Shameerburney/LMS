import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Download, Share2, Copy, Check } from 'lucide-react';

const CodePlayground = ({ language = 'python', initialCode = '', lessonId }) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [pyodide, setPyodide] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadPyodide();
    }, []);

    const loadPyodide = async () => {
        try {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
            script.async = true;

            script.onload = async () => {
                const pyodideInstance = await window.loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
                });

                // Load common packages
                await pyodideInstance.loadPackage(['numpy', 'pandas']);
                setPyodide(pyodideInstance);
                setOutput('✅ Python environment ready! NumPy and Pandas loaded.');
            };

            document.body.appendChild(script);
        } catch (error) {
            setOutput(`❌ Error loading Python: ${error.message}`);
        }
    };

    const runCode = async () => {
        if (!pyodide) {
            setOutput('⏳ Python is still loading... Please wait.');
            return;
        }

        setIsRunning(true);
        setOutput('Running...');

        try {
            // Redirect stdout
            pyodide.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

            // Run user code
            await pyodide.runPythonAsync(code);

            // Get output
            const stdout = pyodide.runPython('sys.stdout.getvalue()');
            setOutput(stdout || '✅ Code executed successfully (no output)');
        } catch (error) {
            setOutput(`❌ Error:\n${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const saveCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code-${lessonId || 'snippet'}.py`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const examples = {
        hello: `print("Hello, World!")`,
        numpy: `import numpy as np\n\n# Create array\narr = np.array([1, 2, 3, 4, 5])\nprint("Array:", arr)\nprint("Mean:", arr.mean())\nprint("Sum:", arr.sum())`,
        pandas: `import pandas as pd\n\n# Create DataFrame\ndata = {\n    'Name': ['Alice', 'Bob', 'Charlie'],\n    'Age': [25, 30, 35],\n    'Score': [85, 90, 95]\n}\ndf = pd.DataFrame(data)\nprint(df)\nprint("\\nAverage Score:", df['Score'].mean())`,
        ml: `import numpy as np\n\n# Simple linear regression\nX = np.array([1, 2, 3, 4, 5])\ny = np.array([2, 4, 5, 4, 5])\n\n# Calculate slope and intercept\nslope = np.cov(X, y)[0][1] / np.var(X)\nintercept = y.mean() - slope * X.mean()\n\nprint(f"Slope: {slope:.2f}")\nprint(f"Intercept: {intercept:.2f}")\nprint(f"Prediction for X=6: {slope * 6 + intercept:.2f}")`,
    };

    return (
        <div className="code-playground">
            <div className="playground-header">
                <h3>🐍 Python Code Playground</h3>
                <div className="playground-actions">
                    <select
                        onChange={(e) => setCode(examples[e.target.value])}
                        className="example-select"
                    >
                        <option value="">Load Example...</option>
                        <option value="hello">Hello World</option>
                        <option value="numpy">NumPy Example</option>
                        <option value="pandas">Pandas Example</option>
                        <option value="ml">ML Example</option>
                    </select>
                    <button onClick={copyCode} className="btn btn-sm btn-ghost">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={saveCode} className="btn btn-sm btn-outline">
                        <Download size={16} />
                        Save
                    </button>
                    <button
                        onClick={runCode}
                        className="btn btn-sm btn-primary"
                        disabled={isRunning || !pyodide}
                    >
                        <Play size={16} />
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                </div>
            </div>

            <div className="editor-container">
                <Editor
                    height="400px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>

            <div className="output-container">
                <div className="output-header">
                    <span>Output</span>
                </div>
                <pre className="output-content">{output}</pre>
            </div>

            <style jsx>{`
        .code-playground {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-top: var(--space-6);
        }

        .playground-header {
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .playground-header h3 {
          margin: 0;
          font-size: var(--text-lg);
        }

        .playground-actions {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }

        .example-select {
          padding: var(--space-2) var(--space-3);
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: var(--text-sm);
          cursor: pointer;
        }

        .editor-container {
          border-bottom: 1px solid var(--border);
        }

        .output-container {
          background: #1e1e1e;
        }

        .output-header {
          padding: var(--space-3) var(--space-4);
          background: #2d2d2d;
          color: #fff;
          font-size: var(--text-sm);
          font-weight: 600;
          border-bottom: 1px solid #3e3e3e;
        }

        .output-content {
          padding: var(--space-4);
          color: #d4d4d4;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
          margin: 0;
          min-height: 150px;
          max-height: 300px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        @media (max-width: 640px) {
          .playground-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-3);
          }

          .playground-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .example-select {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default CodePlayground;
