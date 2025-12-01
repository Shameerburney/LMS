import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Eye, Plus, Search, Pin } from 'lucide-react';
import forumService from '../../services/forum';
import { useAuth } from '../../context/AuthContext';

const ForumHome = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { user } = useAuth();

    // Create Thread State
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('discussion');

    useEffect(() => {
        loadThreads();
    }, []);

    const loadThreads = async () => {
        try {
            const allThreads = await forumService.getAllThreads();
            setThreads(allThreads.sort((a, b) => b.createdAt - a.createdAt));
        } catch (error) {
            console.error('Error loading threads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateThread = async () => {
        if (!newTitle || !newContent) return;

        try {
            await forumService.createThread({
                userId: user.id,
                userName: user.profile.name,
                title: newTitle,
                content: newContent,
                category: newCategory,
            });

            setShowCreateModal(false);
            setNewTitle('');
            setNewContent('');
            loadThreads();
        } catch (error) {
            console.error('Error creating thread:', error);
        }
    };

    const filteredThreads = threads.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="forum-home">
            <div className="forum-header">
                <div className="header-content">
                    <h1>Discussion Forum</h1>
                    <p>Join the community conversation</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                    <Plus size={20} /> New Discussion
                </button>
            </div>

            <div className="forum-controls">
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="threads-list">
                {filteredThreads.map(thread => (
                    <div key={thread.id} className={`thread-card ${thread.isPinned ? 'pinned' : ''}`}>
                        <div className="thread-stats">
                            <div className="stat">
                                <ThumbsUp size={16} />
                                <span>{thread.upvotes}</span>
                            </div>
                            <div className="stat">
                                <MessageSquare size={16} />
                                <span>{thread.replies.length}</span>
                            </div>
                            <div className="stat">
                                <Eye size={16} />
                                <span>{thread.views}</span>
                            </div>
                        </div>

                        <div className="thread-content">
                            <div className="thread-meta">
                                {thread.isPinned && <span className="pinned-badge"><Pin size={12} /> Pinned</span>}
                                <span className={`category-badge ${thread.category}`}>{thread.category}</span>
                                <span className="author">Posted by {thread.userName}</span>
                                <span className="date">{new Date(thread.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3>{thread.title}</h3>
                            <p>{thread.content.substring(0, 150)}...</p>
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Start a New Discussion</h3>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="input-field"
                                placeholder="What's on your mind?"
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="input-field"
                            >
                                <option value="discussion">General Discussion</option>
                                <option value="question">Question</option>
                                <option value="announcement">Announcement</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                className="input-field"
                                rows={5}
                                placeholder="Elaborate on your topic..."
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost">Cancel</button>
                            <button onClick={handleCreateThread} className="btn btn-primary">Post Discussion</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .forum-home {
          max-width: 1000px;
          margin: 0 auto;
        }

        .forum-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-8);
        }

        .forum-controls {
          margin-bottom: var(--space-6);
        }

        .search-bar {
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .search-bar input {
          width: 100%;
          padding: var(--space-3) var(--space-3) var(--space-3) var(--space-10);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .threads-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .thread-card {
          display: flex;
          gap: var(--space-6);
          padding: var(--space-6);
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .thread-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .thread-card.pinned {
          border-color: var(--primary-500);
          background: rgba(99, 102, 241, 0.05);
        }

        .thread-stats {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          min-width: 60px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .thread-content {
          flex: 1;
        }

        .thread-meta {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .category-badge {
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 10px;
        }

        .category-badge.discussion { background: var(--bg-tertiary); color: var(--text-primary); }
        .category-badge.question { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .category-badge.announcement { background: rgba(239, 68, 68, 0.1); color: var(--error); }

        .pinned-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary-500);
          font-weight: 600;
        }

        .thread-content h3 {
          margin: 0 0 var(--space-2) 0;
          font-size: var(--text-lg);
        }

        .thread-content p {
          color: var(--text-secondary);
          margin: 0;
          font-size: var(--text-sm);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
        }

        .modal-content {
          background: var(--bg-primary);
          padding: var(--space-8);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-4);
          margin-top: var(--space-6);
        }
      `}</style>
        </div>
    );
};

export default ForumHome;
