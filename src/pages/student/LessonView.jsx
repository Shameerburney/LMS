import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import VideoPlayer from '../../components/video/VideoPlayer';
import NotesEditor from '../../components/notes/NotesEditor';
import CodePlayground from '../../components/code/CodePlayground';
import TakeQuiz from '../../components/quiz/TakeQuiz';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courses';
import quizService from '../../services/quiz';

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  useEffect(() => {
    loadLesson();
    loadQuizzes();
  }, [id]);

  const loadQuizzes = async () => {
    try {
      // Get all quizzes and filter by lessonId
      const allQuizzes = await quizService.getAllQuizzes();
      const lessonQuizzes = allQuizzes.filter(q => q.lessonId === id);
      setAvailableQuizzes(lessonQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const loadLesson = async () => {
    // For demo, create a sample lesson
    const sampleLesson = {
      id: id,
      title: 'Introduction to Neural Networks',
      description: 'Learn the fundamentals of neural networks and deep learning',
      videoType: 'youtube',
      videoUrl: 'aircAruvnKk', // 3Blue1Brown Neural Networks video
      duration: 1200,
      content: `
# Neural Networks Fundamentals

## What You'll Learn
- Understanding artificial neurons
- Forward propagation
- Activation functions
- Building your first neural network

## Key Concepts
Neural networks are inspired by biological neurons in the human brain. They consist of layers of interconnected nodes that process information.

## Practice Exercise
Try implementing a simple perceptron in the code playground below!
      `,
      codeExample: `import numpy as np

# Simple Perceptron
class Perceptron:
    def __init__(self, input_size):
        self.weights = np.random.randn(input_size)
        self.bias = np.random.randn()
    
    def predict(self, x):
        return 1 if np.dot(x, self.weights) + self.bias > 0 else 0

# Create and test
p = Perceptron(2)
print("Prediction:", p.predict([1, 1]))
print("Weights:", p.weights)
`,
    };

    setLesson(sampleLesson);

    // Load course info
    const courses = await courseService.getAllCourses();
    const relatedCourse = courses[0]; // For demo
    setCourse(relatedCourse);
  };

  const handleVideoProgress = (current, total) => {
    setVideoProgress(current);
  };

  const handleVideoComplete = () => {
    console.log('Lesson completed!');
    // Mark lesson as complete
  };

  if (!lesson) {
    return <div className="loading">Loading lesson...</div>;
  }

  return (
    <div className="lesson-view">
      {/* Header */}
      <div className="lesson-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back to Course
        </button>
        <div className="lesson-info">
          <h1>{lesson.title}</h1>
          <p>{lesson.description}</p>
        </div>
      </div>

      {/* Video Player */}
      <div className="video-section">
        <VideoPlayer
          videoUrl={lesson.videoUrl}
          videoType={lesson.videoType}
          onProgress={handleVideoProgress}
          onComplete={handleVideoComplete}
          initialProgress={0}
        />
      </div>

      {/* Lesson Content */}
      <div className="lesson-content">
        <div className="content-card">
          <h2><BookOpen size={24} /> Lesson Overview</h2>
          <div className="markdown-content">
            {lesson.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i}>{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={i}>{line.substring(3)}</h2>;
              } else if (line.startsWith('- ')) {
                return <li key={i}>{line.substring(2)}</li>;
              } else if (line.trim()) {
                return <p key={i}>{line}</p>;
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Code Playground */}
      {lesson.codeExample && (
        <CodePlayground
          language="python"
          initialCode={lesson.codeExample}
          lessonId={lesson.id}
        />
      )}

      {/* Quiz Section - Show ALL quizzes for this lesson */}
      {availableQuizzes.length > 0 && (
        <div className="quiz-section">
          <h2><CheckCircle size={24} /> Lesson Quizzes ({availableQuizzes.length})</h2>
          {availableQuizzes.map((quiz, index) => (
            <div key={quiz.id} className="quiz-item">
              <h3>{quiz.title || `Quiz ${index + 1}`}</h3>
              {quiz.description && <p className="quiz-description">{quiz.description}</p>}
              <TakeQuiz
                quizId={quiz.id}
                studentId={user.id}
                onComplete={() => {
                  console.log('Quiz completed');
                  loadQuizzes(); // Reload to update status
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Notes Editor */}
      <NotesEditor
        userId={user.id}
        courseId={course?.id || 'demo'}
        lessonId={lesson.id}
        videoTimestamp={videoProgress}
      />

      {/* Next Lesson Button */}
      <div className="lesson-footer">
        <button className="btn btn-primary btn-lg">
          <CheckCircle size={20} />
          Mark as Complete & Continue
        </button>
      </div>

      <style jsx>{`
        .lesson-view {
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading {
          text-align: center;
          padding: var(--space-12);
          font-size: var(--text-lg);
          color: var(--text-secondary);
        }

        .lesson-header {
          margin-bottom: var(--space-6);
        }

        .lesson-info {
          margin-top: var(--space-4);
        }

        .lesson-info h1 {
          margin-bottom: var(--space-2);
        }

        .lesson-info p {
          color: var(--text-secondary);
          font-size: var(--text-lg);
        }

        .video-section {
          margin-bottom: var(--space-6);
        }

        .lesson-content {
          margin-bottom: var(--space-6);
        }

        .quiz-section {
          margin-top: var(--space-8);
          margin-bottom: var(--space-8);
        }

        .quiz-section h2 {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .quiz-item {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-4);
        }

        .quiz-item h3 {
          margin: 0 0 var(--space-2) 0;
          color: var(--primary-500);
        }

        .quiz-description {
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }

        .content-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
        }

        .content-card h2 {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .markdown-content {
          line-height: var(--leading-relaxed);
        }

        .markdown-content h1 {
          font-size: var(--text-2xl);
          margin: var(--space-6) 0 var(--space-4) 0;
        }

        .markdown-content h2 {
          font-size: var(--text-xl);
          margin: var(--space-5) 0 var(--space-3) 0;
        }

        .markdown-content p {
          margin-bottom: var(--space-4);
          color: var(--text-secondary);
        }

        .markdown-content li {
          margin-left: var(--space-6);
          margin-bottom: var(--space-2);
          color: var(--text-secondary);
        }

        .lesson-footer {
          margin-top: var(--space-8);
          padding: var(--space-6);
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          text-align: center;
        }

        @media (max-width: 768px) {
          .lesson-info h1 {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </div>
  );
};

export default LessonView;
