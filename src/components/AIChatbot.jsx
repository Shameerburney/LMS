import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import aiChatbot from '../services/aiChatbot';
import { MessageCircle, Send, X, Trash2, Bot, User } from 'lucide-react';

const AIChatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            loadChatHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadChatHistory = async () => {
        const history = await aiChatbot.getChatHistory(user.id);
        setMessages(history);

        // Send welcome message if no history
        if (history.length === 0) {
            const welcomeMsg = {
                id: `msg-${Date.now()}`,
                userId: user.id,
                message: `Hi ${user.profile.name}! 👋 I'm your AI learning assistant. I can help you track your progress, get course recommendations, and stay motivated. What would you like to know?`,
                isBot: true,
                timestamp: Date.now(),
            };
            setMessages([welcomeMsg]);
            await aiChatbot.saveMessage(user.id, welcomeMsg.message, true);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // Add user message
        const userMsg = {
            id: `msg-${Date.now()}`,
            userId: user.id,
            message: userMessage,
            isBot: false,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMsg]);
        await aiChatbot.saveMessage(user.id, userMessage, false);

        // Get AI response
        try {
            const response = await aiChatbot.chat(user.id, userMessage);

            const botMsg = {
                id: `msg-${Date.now() + 1}`,
                userId: user.id,
                message: response,
                isBot: true,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, botMsg]);
            await aiChatbot.saveMessage(user.id, response, true);
        } catch (error) {
            console.error('Error getting AI response:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear chat history?')) {
            await aiChatbot.clearHistory(user.id);
            setMessages([]);
            loadChatHistory();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button className="chat-fab" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={24} />
                    <span className="chat-badge">AI</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-content">
                            <div className="chat-bot-avatar">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3>AI Learning Assistant</h3>
                                <span className="chat-status">Online</span>
                            </div>
                        </div>
                        <div className="chat-header-actions">
                            <button onClick={handleClearHistory} className="icon-btn" title="Clear history">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="icon-btn" title="Close">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.isBot ? 'message-bot' : 'message-user'}`}>
                                <div className="message-avatar">
                                    {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className="message-content">
                                    <div className="message-text">{msg.message}</div>
                                    <div className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message message-bot">
                                <div className="message-avatar">
                                    <Bot size={16} />
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .chat-fab {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          color: white;
          border: none;
          box-shadow: var(--shadow-xl);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
          z-index: var(--z-fixed);
        }

        .chat-fab:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-2xl);
        }

        .chat-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--error);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }

        .chat-window {
          position: fixed;
          bottom: var(--space-6);
          right: var(--space-6);
          width: 400px;
          height: 600px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-2xl);
          display: flex;
          flex-direction: column;
          z-index: var(--z-fixed);
          animation: slideIn 0.3s ease-out;
        }

        .chat-header {
          padding: var(--space-4);
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          color: white;
          border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-content {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .chat-bot-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-header h3 {
          margin: 0;
          font-size: var(--text-base);
          color: white;
        }

        .chat-status {
          font-size: var(--text-xs);
          opacity: 0.9;
        }

        .chat-header-actions {
          display: flex;
          gap: var(--space-2);
        }

        .icon-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .icon-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .message {
          display: flex;
          gap: var(--space-3);
          animation: fadeIn 0.3s ease-out;
        }

        .message-user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-bot .message-avatar {
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          color: white;
        }

        .message-user .message-avatar {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .message-content {
          max-width: 70%;
        }

        .message-text {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          white-space: pre-wrap;
          word-wrap: break-word;
          line-height: var(--leading-relaxed);
        }

        .message-bot .message-text {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-bottom-left-radius: var(--radius-sm);
        }

        .message-user .message-text {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
          border-bottom-right-radius: var(--radius-sm);
        }

        .message-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-top: var(--space-1);
          padding: 0 var(--space-2);
        }

        .message-user .message-time {
          text-align: right;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: var(--space-3) var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border-bottom-left-radius: var(--radius-sm);
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-tertiary);
          border-radius: var(--radius-full);
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .chat-input-container {
          padding: var(--space-4);
          border-top: 1px solid var(--border);
          display: flex;
          gap: var(--space-3);
        }

        .chat-input {
          flex: 1;
          padding: var(--space-3);
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: var(--text-sm);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .chat-input:focus {
          border-color: var(--primary-500);
        }

        .chat-send-btn {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .chat-window {
            width: calc(100vw - var(--space-8));
            height: calc(100vh - var(--space-8));
            bottom: var(--space-4);
            right: var(--space-4);
          }
        }
      `}</style>
        </>
    );
};

export default AIChatbot;
