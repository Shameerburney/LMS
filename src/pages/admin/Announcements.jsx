import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import dbService from '../../services/db';
import { Megaphone, Plus, Trash2, Users, Calendar } from 'lucide-react';

const Announcements = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('normal');
    const [targetAudience, setTargetAudience] = useState('all');

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const allAnnouncements = await dbService.getAll('announcements');
            const sorted = allAnnouncements.sort((a, b) => b.createdAt - a.createdAt);
            setAnnouncements(sorted);
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    };

    const createAnnouncement = async () => {
        if (!title || !message) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const announcement = {
                id: `announcement-${Date.now()}`,
                title,
                message,
                priority,
                targetAudience,
                createdBy: user.id,
                createdByName: user.profile.name,
                createdByRole: user.role,
                createdAt: Date.now(),
            };

            await dbService.add('announcements', announcement);

            // Create notifications for all users
            const allUsers = await dbService.getAll('users');
            const targetUsers = targetAudience === 'all'
                ? allUsers
                : allUsers.filter(u => u.role === targetAudience);

            for (const targetUser of targetUsers) {
                const notification = {
                    id: `notif-${Date.now()}-${targetUser.id}`,
                    userId: targetUser.id,
                    title: `📢 New Announcement: ${title}`,
                    message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
                    type: 'announcement',
                    read: false,
                    createdAt: Date.now(),
                };
                await dbService.add('notifications', notification);
            }

            alert('Announcement created successfully!');
            setTitle('');
            setMessage('');
            setPriority('normal');
            setTargetAudience('all');
            setShowForm(false);
            loadAnnouncements();
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Error creating announcement');
        }
    };

    const deleteAnnouncement = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await dbService.delete('announcements', id);
                loadAnnouncements();
            } catch (error) {
                console.error('Error deleting announcement:', error);
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'var(--error)';
            case 'important': return 'var(--warning)';
            default: return 'var(--primary-500)';
        }
    };

    return (
        <div className="announcements-page">
            <div className="page-header">
                <div>
                    <h1><Megaphone size={32} /> Announcements</h1>
                    <p>Create and manage announcements for students</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            {showForm && (
                <div className="announcement-form">
                    <h3>Create New Announcement</h3>

                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Important: Exam Schedule Updated"
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Message *</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your announcement message..."
                            className="input-field"
                            rows={5}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="input-field"
                            >
                                <option value="normal">Normal</option>
                                <option value="important">Important</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Target Audience</label>
                            <select
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="input-field"
                            >
                                <option value="all">All Users</option>
                                <option value="student">Students Only</option>
                                <option value="instructor">Instructors Only</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button onClick={() => setShowForm(false)} className="btn btn-outline">
                            Cancel
                        </button>
                        <button onClick={createAnnouncement} className="btn btn-primary">
                            <Megaphone size={18} />
                            Publish Announcement
                        </button>
                    </div>
                </div>
            )}

            <div className="announcements-list">
                {announcements.length === 0 ? (
                    <div className="empty-state">
                        <Megaphone size={64} />
                        <h3>No announcements yet</h3>
                        <p>Create your first announcement to notify users</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="announcement-card"
                            style={{ borderLeftColor: getPriorityColor(announcement.priority) }}
                        >
                            <div className="announcement-header">
                                <div>
                                    <h3>{announcement.title}</h3>
                                    <div className="announcement-meta">
                                        <span className="meta-item">
                                            <Users size={14} />
                                            {announcement.createdByName} ({announcement.createdByRole})
                                        </span>
                                        <span className="meta-item">
                                            <Calendar size={14} />
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className={`priority-badge ${announcement.priority}`}>
                                            {announcement.priority}
                                        </span>
                                        <span className="audience-badge">
                                            {announcement.targetAudience === 'all' ? 'All Users' : announcement.targetAudience}
                                        </span>
                                    </div>
                                </div>
                                {announcement.createdBy === user.id && (
                                    <button
                                        onClick={() => deleteAnnouncement(announcement.id)}
                                        className="btn-icon btn-danger"
                                        title="Delete announcement"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                            <p className="announcement-message">{announcement.message}</p>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
        .announcements-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-8);
        }

        .page-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .announcement-form {
          background: var(--bg-primary);
          border: 2px solid var(--primary-500);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .announcement-form h3 {
          margin-bottom: var(--space-4);
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .input-field {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: inherit;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        .form-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: flex-end;
          margin-top: var(--space-6);
        }

        .announcements-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-12);
          color: var(--text-secondary);
        }

        .empty-state svg {
          color: var(--text-tertiary);
          margin-bottom: var(--space-4);
        }

        .announcement-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-left: 4px solid var(--primary-500);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          transition: all var(--transition-base);
        }

        .announcement-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .announcement-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-3);
        }

        .announcement-header h3 {
          margin: 0 0 var(--space-2) 0;
        }

        .announcement-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .priority-badge {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.normal {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary-500);
        }

        .priority-badge.important {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
        }

        .priority-badge.urgent {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .audience-badge {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          background: rgba(20, 184, 166, 0.1);
          color: var(--accent-500);
          text-transform: capitalize;
        }

        .announcement-message {
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          white-space: pre-wrap;
        }

        .btn-icon {
          padding: var(--space-2);
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .btn-icon:hover {
          background: var(--bg-secondary);
        }

        .btn-danger {
          color: var(--error);
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: var(--space-4);
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Announcements;
