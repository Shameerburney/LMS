import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courses';
import { PlusCircle, Upload, Save, ArrowLeft } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/constants';

const CreateCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES.AI,
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        duration: 10,
        prerequisites: '',
        learningOutcomes: '',
        tags: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert comma-separated strings to arrays
            const prerequisites = formData.prerequisites
                .split(',')
                .map((p) => p.trim())
                .filter((p) => p);

            const learningOutcomes = formData.learningOutcomes
                .split(',')
                .map((o) => o.trim())
                .filter((o) => o);

            const tags = formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);

            // Generate a simple gradient thumbnail
            const colors = {
                [CATEGORIES.AI]: ['#6366f1', '#14b8a6'],
                [CATEGORIES.PYTHON]: ['#ec4899', '#6366f1'],
                [CATEGORIES.DATA_SCIENCE]: ['#14b8a6', '#f59e0b'],
                [CATEGORIES.ML]: ['#8b5cf6', '#ec4899'],
                [CATEGORIES.DL]: ['#f59e0b', '#ef4444'],
                [CATEGORIES.GEN_AI]: ['#14b8a6', '#6366f1'],
            };

            const [color1, color2] = colors[formData.category] || ['#6366f1', '#14b8a6'];
            const thumbnail = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${color1};stop-opacity:1"/>
              <stop offset="100%" style="stop-color:${color2};stop-opacity:1"/>
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#g)"/>
          <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">${formData.title.substring(0, 30)}</text>
        </svg>
      `)}`;

            const courseData = {
                title: formData.title,
                description: formData.description,
                thumbnail,
                instructor: user.id,
                category: formData.category,
                difficulty: formData.difficulty,
                duration: parseInt(formData.duration),
                prerequisites,
                learningOutcomes,
                tags,
                published: true,
            };

            await courseService.createCourse(courseData);
            alert('Course created successfully!');
            navigate('/instructor');
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-course">
            <div className="page-header">
                <button onClick={() => navigate('/instructor')} className="btn btn-ghost">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <h1>Create New Course</h1>
                <p>Fill in the details to create a new course for your students</p>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
                <div className="form-section">
                    <h2>Basic Information</h2>

                    <div className="form-group">
                        <label htmlFor="title">Course Title *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="input"
                            placeholder="e.g., Introduction to Machine Learning"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            className="input"
                            placeholder="Describe what students will learn in this course..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                className="input"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {Object.values(CATEGORIES).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty">Difficulty *</label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                className="input"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                            >
                                {Object.values(DIFFICULTY_LEVELS).map((level) => (
                                    <option key={level} value={level}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration (hours) *</label>
                            <input
                                id="duration"
                                name="duration"
                                type="number"
                                className="input"
                                placeholder="e.g., 40"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Course Details</h2>

                    <div className="form-group">
                        <label htmlFor="prerequisites">Prerequisites (comma-separated)</label>
                        <input
                            id="prerequisites"
                            name="prerequisites"
                            type="text"
                            className="input"
                            placeholder="e.g., Basic Python, Mathematics"
                            value={formData.prerequisites}
                            onChange={handleChange}
                        />
                        <small>Separate multiple prerequisites with commas</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="learningOutcomes">Learning Outcomes (comma-separated) *</label>
                        <textarea
                            id="learningOutcomes"
                            name="learningOutcomes"
                            className="input"
                            placeholder="e.g., Build ML models, Understand algorithms, Deploy AI applications"
                            value={formData.learningOutcomes}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                        <small>Separate multiple outcomes with commas</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            className="input"
                            placeholder="e.g., AI, Python, Machine Learning"
                            value={formData.tags}
                            onChange={handleChange}
                        />
                        <small>Separate multiple tags with commas</small>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/instructor')} className="btn btn-outline">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Creating Course...' : 'Create Course'}
                    </button>
                </div>
            </form>

            <style jsx>{`
        .create-course {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: var(--space-8);
        }

        .page-header h1 {
          margin: var(--space-4) 0 var(--space-2) 0;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .course-form {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
        }

        .form-section {
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-8);
          border-bottom: 1px solid var(--border);
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h2 {
          margin-bottom: var(--space-6);
          color: var(--text-primary);
        }

        .form-group {
          margin-bottom: var(--space-5);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--space-2);
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .form-group small {
          display: block;
          margin-top: var(--space-2);
          color: var(--text-tertiary);
          font-size: var(--text-xs);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .form-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: flex-end;
          padding-top: var(--space-6);
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default CreateCourse;
