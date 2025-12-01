import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import quizService from '../../services/quiz';
import courseService from '../../services/courses';
import dbService from '../../services/db';

const QuizNotification = () => {
    const { user } = useAuth();
    const [newQuizzes, setNewQuizzes] = useState([]);
    const [dismissed, setDismissed] = useState([]);

    useEffect(() => {
        if (user && user.role === 'student') {
            checkForNewQuizzes();
        }
    }, [user]);

    const checkForNewQuizzes = async () => {
        try {
            // Get user's enrolled courses
            const enrolledCourses = user.enrolledCourses || [];

            // Get all quizzes
            const allQuizzes = await dbService.getAll('quizzes');

            // Get user's submissions to check which quizzes they've taken
            const submissions = await dbService.getAllByIndex('submissions', 'studentId', user.id);
            const takenQuizIds = submissions.map(s => s.quizId);

            // Filter quizzes that are:
            // 1. In enrolled courses
            // 2. Not yet taken
            // 3. Created in the last 7 days
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

            const newQuizList = allQuizzes.filter(quiz =>
                enrolledCourses.includes(quiz.courseId) &&
                !takenQuizIds.includes(quiz.id) &&
                quiz.createdAt > sevenDaysAgo
            );

            setNewQuizzes(newQuizList);
        } catch (error) {
            console.error('Error checking for new quizzes:', error);
        }
    };

    const handleDismiss = (quizId) => {
        setDismissed([...dismissed, quizId]);
    };

    const visibleQuizzes = newQuizzes.filter(q => !dismissed.includes(q.id));

    if (visibleQuizzes.length === 0) return null;

    return (
        <div className="quiz-notifications">
            {visibleQuizzes.map(quiz => (
                <div key={quiz.id} className="notification-card">
                    <div className="notification-icon">
                        <AlertCircle size={24} />
                    </div>
                    <div className="notification-content">
                        <h4>New Quiz Assigned!</h4>
                        <p>
                            A new quiz "<strong>{quiz.title}</strong>" has been assigned to your course.
                            Please take it when you're ready.
                        </p>
                    </div>
                    <button
                        onClick={() => handleDismiss(quiz.id)}
                        className="dismiss-btn"
                        aria-label="Dismiss notification"
                    >
                        <X size={20} />
                    </button>
                </div>
            ))}

            <style jsx>{`
        .quiz-notifications {
          position: fixed;
          top: 80px;
          right: var(--space-6);
          z-index: var(--z-modal);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 400px;
        }

        .notification-card {
          background: var(--bg-primary);
          border: 2px solid var(--warning);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          display: flex;
          gap: var(--space-3);
          box-shadow: var(--shadow-lg);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .notification-icon {
          color: var(--warning);
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h4 {
          margin: 0 0 var(--space-2) 0;
          color: var(--text-primary);
          font-size: var(--text-base);
        }

        .notification-content p {
          margin: 0;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
        }

        .notification-content strong {
          color: var(--text-primary);
        }

        .dismiss-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .dismiss-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .quiz-notifications {
            left: var(--space-4);
            right: var(--space-4);
            max-width: none;
          }
        }
      `}</style>
        </div>
    );
};

export default QuizNotification;
