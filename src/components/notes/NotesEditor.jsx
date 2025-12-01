import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Download, Clock } from 'lucide-react';
import dbService from '../../services/db';
import jsPDF from 'jspdf';

const NotesEditor = ({ userId, courseId, lessonId, videoTimestamp = null }) => {
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        loadNotes();
    }, [lessonId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (content) {
                saveNote();
            }
        }, 3000); // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(timer);
    }, [content]);

    const loadNotes = async () => {
        try {
            const allNotes = await dbService.getAll('notes');
            const lessonNotes = allNotes.filter(
                n => n.userId === userId && n.lessonId === lessonId
            );
            setNotes(lessonNotes);

            // Load the most recent note
            if (lessonNotes.length > 0) {
                setContent(lessonNotes[0].content);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const saveNote = async () => {
        setSaving(true);
        try {
            const note = {
                id: `note-${Date.now()}`,
                userId,
                courseId,
                lessonId,
                content,
                timestamp: videoTimestamp,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            await dbService.add('notes', note);
            setLastSaved(new Date());
            loadNotes();
        } catch (error) {
            console.error('Error saving note:', error);
        } finally {
            setSaving(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;

        // Title
        doc.setFontSize(16);
        doc.text('Course Notes', margin, margin);

        // Content
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(
            content.replace(/<[^>]*>/g, ''), // Strip HTML tags
            maxWidth
        );
        doc.text(textLines, margin, margin + 10);

        doc.save(`notes-${lessonId}.pdf`);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            ['link'],
            ['clean'],
        ],
    };

    return (
        <div className="notes-editor">
            <div className="notes-header">
                <h3>My Notes</h3>
                <div className="notes-actions">
                    {lastSaved && (
                        <span className="last-saved">
                            <Clock size={14} />
                            Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button onClick={saveNote} className="btn btn-sm btn-outline" disabled={saving}>
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={exportToPDF} className="btn btn-sm btn-primary">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Take notes while learning..."
            />

            {videoTimestamp && (
                <div className="timestamp-info">
                    📍 Linked to video at {Math.floor(videoTimestamp / 60)}:{Math.floor(videoTimestamp % 60).toString().padStart(2, '0')}
                </div>
            )}

            <style jsx>{`
        .notes-editor {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-top: var(--space-6);
        }

        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .notes-header h3 {
          margin: 0;
        }

        .notes-actions {
          display: flex;
          gap: var(--space-3);
          align-items: center;
        }

        .last-saved {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .timestamp-info {
          margin-top: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        :global(.ql-container) {
          min-height: 200px;
          font-family: var(--font-body);
        }

        :global(.ql-editor) {
          min-height: 200px;
        }

        @media (max-width: 640px) {
          .notes-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-3);
          }

          .notes-actions {
            width: 100%;
            flex-wrap: wrap;
          }
        }
      `}</style>
        </div>
    );
};

export default NotesEditor;
