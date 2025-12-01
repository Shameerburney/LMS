import React, { useState } from 'react';
import { Save, Calendar, FileText } from 'lucide-react';
import assignmentService from '../../services/assignment';

const CreateAssignment = ({ courseId, lessonId, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!title || !dueDate) return;

        setSaving(true);
        try {
            const assignmentData = {
                courseId,
                lessonId,
                title,
                description,
                dueDate: new Date(dueDate).getTime(),
                maxScore: parseInt(maxScore),
            };

            await assignmentService.createAssignment(assignmentData);
            if (onSave) onSave();
            alert('Assignment created successfully!');
        } catch (error) {
            console.error('Error creating assignment:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="create-assignment">
            <div className="form-header">
                <h3>Create Assignment</h3>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={saving || !title || !dueDate}
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Create Assignment'}
                </button>
            </div>

            <div className="form-group">
                <label>Assignment Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Final Project Proposal"
                    className="input-field"
                />
            </div>

            <div className="form-group">
                <label>Description & Instructions</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed instructions for the assignment..."
                    className="input-field"
                    rows={5}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Due Date</label>
                    <div className="input-icon-wrapper">
                        <Calendar size={18} className="input-icon" />
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input-field with-icon"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Max Score</label>
                    <input
                        type="number"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>

            <style jsx>{`
        .create-assignment {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .input-icon-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .input-field.with-icon {
          padding-left: var(--space-10);
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default CreateAssignment;
