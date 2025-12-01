import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, User, Check } from 'lucide-react';
import forumService from '../../services/forum';
import { useAuth } from '../../context/AuthContext';

const ThreadView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [thread, setThread] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThread();
    }, [id]);

    const loadThread = async () => {
        try {
            const data = await forumService.getThread(id);
            setThread(data);
        } catch (error) {
            console.error('Error loading thread:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyContent) return;

        try {
            await forumService.addReply(id, {
                userId: user.id,
                userName: user.profile.name,
                content: replyContent,
            });
            setReplyContent('');
            loadThread();
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleUpvote = async () => {
        try {
            await forumService.toggleUpvote(id);
            loadThread();
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    if (loading) return <div>Loading discussion...</div>;
    if (!thread) return <div>Discussion not found</div>;

    return (
        <div className="thread-view">
            <button onClick={() => navigate('/forum')} className="btn btn-ghost back-btn">
                <ArrowLeft size={20} /> Back to Forum
            </button>

            <div className="main-post">
                <div className="post-header">
                    <div className="author-info">
                        <div className="avatar">
                            <User size={24} />
                        </div>
                        <div>
                            <span className="author-name">{thread.userName}</span>
                            <span className="post-date">{new Date(thread.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <span className={`category-badge ${thread.category}`}>{thread.category}</span>
                </div>

                <h1>{thread.title}</h1>
                <div className="post-content">
                    <p>{thread.content}</p>
                </div>

                <div className="post-actions">
                    <button onClick={handleUpvote} className="btn btn-outline btn-sm">
                        <ThumbsUp size={16} /> {thread.upvotes} Upvotes
                    </button>
                    <span className="reply-count">
                        <MessageSquare size={16} /> {thread.replies.length} Replies
                    </span>
                </div>
            </div>

            <div className="replies-section">
                <h3>Replies</h3>

                <div className="reply-form">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        rows={3}
                        className="input-field"
                    />
                    <button
                        onClick={handleReply}
                        className="btn btn-primary"
                        disabled={!replyContent}
                    >
                        Post Reply
                    </button>
                </div>

                <div className="replies-list">
                    {thread.replies.map(reply => (
                        <div key={reply.id} className={`reply-card ${reply.isBestAnswer ? 'best-answer' : ''}`}>
                            {reply.isBestAnswer && (
                                <div className="best-answer-badge">
                                    <Check size={14} /> Best Answer
                                </div>
                            )}

                            <div className="reply-header">
                                <span className="author-name">{reply.userName}</span>
                                <span className="post-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="reply-content">
                                <p>{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .thread-view {
          max-width: 800px;
          margin: 0 auto;
        }

        .back-btn {
          margin-bottom: var(--space-6);
        }

        .main-post {
          background: var(--bg-primary);
          padding: var(--space-8);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          margin-bottom: var(--space-8);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-6);
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-name {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
        }

        .post-date {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .category-badge {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
        }

        .category-badge.discussion { background: var(--bg-tertiary); }
        .category-badge.question { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .category-badge.announcement { background: rgba(239, 68, 68, 0.1); color: var(--error); }

        .post-content {
          font-size: var(--text-lg);
          line-height: var(--leading-relaxed);
          color: var(--text-primary);
          margin-bottom: var(--space-6);
        }

        .post-actions {
          display: flex;
          gap: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border);
        }

        .reply-count {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .replies-section h3 {
          margin-bottom: var(--space-6);
        }

        .reply-form {
          background: var(--bg-secondary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-8);
        }

        .reply-form textarea {
          width: 100%;
          margin-bottom: var(--space-4);
          background: var(--bg-primary);
        }

        .replies-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .reply-card {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          position: relative;
        }

        .reply-card.best-answer {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.05);
        }

        .best-answer-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: var(--success);
          color: white;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .reply-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }
      `}</style>
        </div>
    );
};

export default ThreadView;
