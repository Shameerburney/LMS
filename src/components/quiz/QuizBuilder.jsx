import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import quizService from '../../services/quiz';
import courseService from '../../services/courses';

const QuizBuilder = ({ courseId: initialCourseId, lessonId, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(initialCourseId || '');
    const [courses, setCourses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const allCourses = await courseService.getAllCourses();
            setCourses(allCourses);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    };

    const addQuestion = (type = 'mcq') => {
        const newQuestion = {
            id: `q-${Date.now()}`,
            type,
            question: '',
            options: type === 'mcq' ? ['', '', '', ''] : ['True', 'False'],
            correctAnswer: '',
            points: 10,
            explanation: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const updateOption = (qId, index, value) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[index] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleSave = async () => {
        if (!title || questions.length === 0) {
            alert('Please add a title and at least one question');
            return;
        }

        if (!selectedCourse) {
            alert('Please select a course for this quiz');
            return;
        }

        setSaving(true);
        try {
            const quizData = {
                courseId: selectedCourse,
                lessonId,
                title,
                description,
                questions,
                passingScore: 70,
                duration: 30,
                createdAt: Date.now()
            };

            await quizService.createQuiz(quizData);
            if (onSave) onSave();
            alert('Quiz created successfully!');
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Error creating quiz. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="quiz-builder">
            <div className="builder-header">
                <h3>Create Quiz</h3>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={saving || !title || questions.length === 0 || !selectedCourse}
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Create Quiz'}
                </button>
            </div>

            <div className="form-group">
                <label>Select Course *</label>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="input-field"
                    required
                >
                    <option value="">-- Select a Course --</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Quiz Title *</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Week 1 Assessment"
                    className="input-field"
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the quiz..."
                    className="input-field"
                    rows={2}
                />
            </div>

            <div className="questions-list">
                {questions.map((q, index) => (
                    <div key={q.id} className="question-card">
                        <div className="question-header">
                            <h4>Question {index + 1}</h4>
                            <button onClick={() => removeQuestion(q.id)} className="btn btn-icon btn-danger">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                                placeholder="Enter question text..."
                                className="input-field"
                            />
                        </div>

                        {q.type === 'mcq' && (
                            <div className="options-grid">
                                {q.options.map((opt, i) => (
                                    <div key={i} className="option-row">
                                        <input
                                            type="radio"
                                            name={`correct-${q.id}`}
                                            checked={q.correctAnswer === opt && opt !== ''}
                                            onChange={() => updateQuestion(q.id, 'correctAnswer', opt)}
                                        />
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => updateOption(q.id, i, e.target.value)}
                                            placeholder={`Option ${i + 1}`}
                                            className="input-field"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === 'true-false' && (
                            <div className="options-grid">
                                {q.options.map((opt, i) => (
                                    <div key={i} className="option-row">
                                        <input
                                            type="radio"
                                            name={`correct-${q.id}`}
                                            checked={q.correctAnswer === opt}
                                            onChange={() => updateQuestion(q.id, 'correctAnswer', opt)}
                                        />
                                        <label>{opt}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Points</label>
                            <input
                                type="number"
                                value={q.points}
                                onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value))}
                                className="input-field"
                                style={{ width: '100px' }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-buttons">
                <button onClick={() => addQuestion('mcq')} className="btn btn-outline">
                    <Plus size={18} /> Add Multiple Choice
                </button>
                <button onClick={() => addQuestion('true-false')} className="btn btn-outline">
                    <Plus size={18} /> Add True/False
                </button>
            </div>

            <style jsx>{`
        .quiz-builder {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
        }

        .builder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .question-card {
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          border: 1px solid var(--border);
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .add-buttons {
          display: flex;
          gap: var(--space-4);
          margin-top: var(--space-6);
        }

        .input-field {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
        }
      `}</style>
        </div>
    );
};

export default QuizBuilder;
