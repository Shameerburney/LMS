import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import quizService from '../../services/quiz';

const TakeQuiz = ({ quizId, studentId, onComplete }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuiz();
    }, [quizId]);

    const loadQuiz = async () => {
        try {
            const quizData = await quizService.getQuiz(quizId);
            setQuiz(quizData);
        } catch (error) {
            console.error('Error loading quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, value) => {
        if (submitted) return;
        setAnswers({
            ...answers,
            [questionId]: value
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        // Calculate score locally for immediate feedback
        let calculatedScore = 0;
        let totalPoints = 0;

        quiz.questions.forEach(q => {
            totalPoints += q.points;
            if (answers[q.id] === q.correctAnswer) {
                calculatedScore += q.points;
            }
        });

        const finalScore = (calculatedScore / totalPoints) * 100;
        setScore(finalScore);
        setSubmitted(true);

        // Save submission
        await quizService.submitQuiz({
            quizId,
            studentId,
            answers,
            quiz, // Pass quiz data for validation
            score: finalScore
        });

        if (onComplete) onComplete(finalScore);
    };

    if (loading) return <div>Loading quiz...</div>;
    if (!quiz) return <div>Quiz not found</div>;

    return (
        <div className="take-quiz">
            <div className="quiz-header">
                <h2>{quiz.title}</h2>
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                    <span><Clock size={16} /> {quiz.duration} mins</span>
                    <span>Pass Mark: {quiz.passingScore}%</span>
                </div>
            </div>

            {submitted && (
                <div className={`result-card ${score >= quiz.passingScore ? 'passed' : 'failed'}`}>
                    <div className="score-circle">
                        <span>{Math.round(score)}%</span>
                    </div>
                    <div className="result-info">
                        <h3>{score >= quiz.passingScore ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}</h3>
                        <p>{score >= quiz.passingScore ? 'You passed the quiz!' : 'You didn\'t meet the passing score.'}</p>
                    </div>
                </div>
            )}

            <div className="questions-list">
                {quiz.questions.map((q, index) => (
                    <div key={q.id} className={`question-card ${submitted ? (answers[q.id] === q.correctAnswer ? 'correct' : 'incorrect') : ''}`}>
                        <div className="question-text">
                            <span className="q-number">{index + 1}.</span>
                            <h4>{q.question}</h4>
                            <span className="points-badge">{q.points} pts</span>
                        </div>

                        <div className="options-list">
                            {q.options.map((opt, i) => (
                                <label
                                    key={i}
                                    className={`option-label ${answers[q.id] === opt ? 'selected' : ''} ${submitted && q.correctAnswer === opt ? 'correct-answer' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answers[q.id] === opt}
                                        onChange={() => handleOptionSelect(q.id, opt)}
                                        disabled={submitted}
                                    />
                                    {opt}
                                    {submitted && q.correctAnswer === opt && <CheckCircle size={16} className="icon-correct" />}
                                    {submitted && answers[q.id] === opt && answers[q.id] !== q.correctAnswer && <XCircle size={16} className="icon-wrong" />}
                                </label>
                            ))}
                        </div>

                        {submitted && (
                            <div className="explanation">
                                <strong>Explanation:</strong> {q.explanation || 'No explanation provided.'}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!submitted && (
                <div className="quiz-footer">
                    <button onClick={handleSubmit} className="btn btn-primary btn-lg">
                        Submit Quiz
                    </button>
                </div>
            )}

            <style jsx>{`
        .take-quiz {
          max-width: 800px;
          margin: 0 auto;
        }

        .quiz-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .quiz-meta {
          display: flex;
          justify-content: center;
          gap: var(--space-4);
          margin-top: var(--space-4);
          color: var(--text-secondary);
        }

        .result-card {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-8);
          background: var(--bg-secondary);
          border: 1px solid var(--border);
        }

        .result-card.passed {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.1);
        }

        .result-card.failed {
          border-color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-2xl);
          font-weight: 700;
          border: 4px solid currentColor;
        }

        .passed .score-circle { color: var(--success); }
        .failed .score-circle { color: var(--error); }

        .question-card {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          margin-bottom: var(--space-6);
        }

        .question-card.correct { border-color: var(--success); }
        .question-card.incorrect { border-color: var(--error); }

        .question-text {
          display: flex;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .q-number {
          font-weight: 700;
          color: var(--primary-500);
        }

        .points-badge {
          margin-left: auto;
          font-size: var(--text-xs);
          background: var(--bg-secondary);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .option-label {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .option-label:hover:not(.disabled) {
          background: var(--bg-secondary);
        }

        .option-label.selected {
          border-color: var(--primary-500);
          background: rgba(99, 102, 241, 0.1);
        }

        .option-label.correct-answer {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.1);
        }

        .explanation {
          margin-top: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          font-size: var(--text-sm);
        }

        .quiz-footer {
          text-align: center;
          margin-top: var(--space-8);
        }

        .icon-correct { color: var(--success); margin-left: auto; }
        .icon-wrong { color: var(--error); margin-left: auto; }
      `}</style>
        </div>
    );
};

export default TakeQuiz;
