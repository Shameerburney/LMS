import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuizBuilder from '../../components/quiz/QuizBuilder';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId') || '';
  const lessonId = searchParams.get('lessonId') || '';
  const [customLessonId, setCustomLessonId] = useState(lessonId);

  const handleSave = () => {
    alert('Quiz created successfully!');
    navigate(-1);
  };

  return (
    <div className="create-quiz-page">
      <button onClick={() => navigate(-1)} className="btn btn-ghost">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="page-header">
        <h1>Create New Quiz</h1>
        <p>Build a quiz for your students with multiple choice and true/false questions</p>
      </div>

      <div className="lesson-id-input">
        <label>Lesson ID (Optional - Leave blank for course-wide quiz)</label>
        <input
          type="text"
          value={customLessonId}
          onChange={(e) => setCustomLessonId(e.target.value)}
          placeholder="e.g., 1764599477191-7n1abuynz"
          className="input-field"
        />
        <small>💡 Tip: Copy the lesson ID from the URL when viewing a lesson (the part after /lesson/)</small>
      </div>

      <QuizBuilder
        courseId={courseId}
        lessonId={customLessonId}
        onSave={handleSave}
      />

      <style jsx>{`
        .create-quiz-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: var(--space-6);
        }

        .page-header {
          margin: var(--space-6) 0;
        }

        .page-header h1 {
          margin-bottom: var(--space-2);
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .lesson-id-input {
          background: var(--bg-secondary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          border: 2px solid var(--primary-500);
        }

        .lesson-id-input label {
          display: block;
          font-weight: 600;
          margin-bottom: var(--space-2);
          color: var(--primary-500);
        }

        .lesson-id-input small {
          display: block;
          color: var(--text-secondary);
          margin-top: var(--space-2);
          font-size: var(--text-sm);
        }

        .input-field {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default CreateQuiz;
