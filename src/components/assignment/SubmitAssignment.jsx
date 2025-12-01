import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import assignmentService from '../../services/assignment';

const SubmitAssignment = ({ assignmentId, studentId, onComplete }) => {
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setSubmitting(true);
        try {
            // Convert file to base64 (for demo purposes - in prod use cloud storage)
            const reader = new FileReader();
            reader.onloadend = async () => {
                const fileUrl = reader.result;

                await assignmentService.submitAssignment({
                    assignmentId,
                    studentId,
                    fileUrl,
                    fileName: file.name,
                    fileType: file.type,
                    comment
                });

                setSubmitted(true);
                if (onComplete) onComplete();
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error submitting assignment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="submission-success">
                <CheckCircle size={48} className="success-icon" />
                <h3>Assignment Submitted!</h3>
                <p>Your work has been sent for grading.</p>
                <div className="submitted-file">
                    <File size={20} />
                    <span>{file?.name}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="submit-assignment">
            <h3>Submit Your Work</h3>

            <div className="upload-area">
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="file-input"
                />
                <label htmlFor="file-upload" className="upload-label">
                    <Upload size={32} />
                    <span>{file ? file.name : 'Click to upload or drag and drop'}</span>
                    <span className="file-hint">PDF, DOCX, ZIP supported</span>
                </label>
            </div>

            <div className="form-group">
                <label>Add a comment (optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Any notes for the instructor..."
                    className="input-field"
                    rows={3}
                />
            </div>

            <button
                onClick={handleSubmit}
                className="btn btn-primary btn-block"
                disabled={!file || submitting}
            >
                {submitting ? 'Uploading...' : 'Submit Assignment'}
            </button>

            <style jsx>{`
        .submit-assignment {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          max-width: 500px;
        }

        .upload-area {
          margin-bottom: var(--space-4);
        }

        .file-input {
          display: none;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-8);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: center;
        }

        .upload-label:hover {
          border-color: var(--primary-500);
          background: var(--bg-secondary);
        }

        .file-hint {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .submission-success {
          text-align: center;
          padding: var(--space-8);
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--success);
        }

        .success-icon {
          color: var(--success);
          margin-bottom: var(--space-4);
        }

        .submitted-file {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          margin-top: var(--space-4);
          font-size: var(--text-sm);
        }
      `}</style>
        </div>
    );
};

export default SubmitAssignment;
