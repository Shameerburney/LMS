import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../../services/courses';
import { ArrowLeft, Clock, Star, BookOpen, Play, CheckCircle } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const courseData = await courseService.getCourse(id);
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading course...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="course-detail">
      <Link to="/courses" className="back-link">
        <ArrowLeft size={20} />
        Back to Courses
      </Link>

      <div className="course-hero">
        <div className="hero-content">
          <span className="badge badge-primary">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          <div className="course-meta">
            <span>
              <Star size={18} fill="var(--warning)" stroke="var(--warning)" />
              {course.rating} Rating
            </span>
            <span>
              <Clock size={18} />
              {course.duration} hours
            </span>
            <span>
              <BookOpen size={18} />
              {course.enrolledStudents.length} Students
            </span>
          </div>

          <button className="btn btn-primary btn-lg">
            <Play size={20} />
            Start Learning
          </button>
        </div>

        <div className="hero-image">
          <img src={course.thumbnail} alt={course.title} />
        </div>
      </div>

      <div className="course-content-section">
        <div className="content-main">
          <section className="section">
            <h2>What You'll Learn</h2>
            <ul className="learning-outcomes">
              {course.learningOutcomes.map((outcome, index) => (
                <li key={index}>
                  <CheckCircle size={20} />
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          <section className="section">
            <h2>Course Content</h2>
            <div className="lessons-list">
              <div className="lesson-item">
                <div className="lesson-info">
                  <div className="lesson-icon">
                    <Play size={20} />
                  </div>
                  <div>
                    <h4>Introduction to Neural Networks</h4>
                    <span className="lesson-duration">20 min</span>
                  </div>
                </div>
                <Link to={`/lesson/${course.id}`} className="btn btn-sm btn-primary">
                  Start Lesson
                </Link>
              </div>

              <div className="lesson-item">
                <div className="lesson-info">
                  <div className="lesson-icon">
                    <Play size={20} />
                  </div>
                  <div>
                    <h4>Building Your First Model</h4>
                    <span className="lesson-duration">35 min</span>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline" disabled>
                  Locked
                </button>
              </div>

              <div className="lesson-item">
                <div className="lesson-info">
                  <div className="lesson-icon">
                    <Play size={20} />
                  </div>
                  <div>
                    <h4>Practice: Code Your Own Network</h4>
                    <span className="lesson-duration">45 min</span>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline" disabled>
                  Locked
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="content-sidebar">
          <div className="info-card">
            <h3>Course Details</h3>
            <div className="detail-item">
              <strong>Difficulty:</strong>
              <span className="badge badge-info">{course.difficulty}</span>
            </div>
            <div className="detail-item">
              <strong>Prerequisites:</strong>
              <ul>
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
            <div className="detail-item">
              <strong>Tags:</strong>
              <div className="tags">
                {course.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div >

      <style jsx>{`
        .course-detail {
          max-width: 1400px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--primary-500);
          font-weight: 600;
          margin-bottom: var(--space-6);
          text-decoration: none;
        }

        .course-hero {
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          border-radius: var(--radius-2xl);
          padding: var(--space-10);
          margin-bottom: var(--space-8);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
          color: white;
        }

        .hero-content h1 {
          color: white;
          margin: var(--space-4) 0;
        }

        .hero-content p {
          color: rgba(255, 255, 255, 0.9);
          font-size: var(--text-lg);
          margin-bottom: var(--space-6);
        }

        .course-meta {
          display: flex;
          gap: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .course-meta span {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .hero-image {
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-content-section {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: var(--space-8);
        }

        .section {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .learning-outcomes {
          list-style: none;
          display: grid;
          gap: var(--space-3);
        }

        .learning-outcomes li {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--text-secondary);
        }

        .learning-outcomes li svg {
          color: var(--success);
          flex-shrink: 0;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .lesson-item:hover {
          background: var(--bg-tertiary);
          transform: translateX(4px);
        }

        .lesson-icon {
          width: 40px;
          height: 40px;
          background: var(--primary-500);
          color: white;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-info h4 {
          margin: 0 0 var(--space-1) 0;
          color: var(--text-primary);
        }

        .lesson-info span {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .info-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          position: sticky;
          top: var(--space-6);
        }

        .info-card h3 {
          margin-bottom: var(--space-4);
        }

        .detail-item {
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item strong {
          display: block;
          margin-bottom: var(--space-2);
          color: var(--text-primary);
        }

        .detail-item ul {
          list-style: none;
          color: var(--text-secondary);
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .tag {
          padding: var(--space-1) var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .course-hero {
            grid-template-columns: 1fr;
          }

          .course-content-section {
            grid-template-columns: 1fr;
          }

          .info-card {
            position: static;
          }
        }
      `}</style>
    </div >
  );
};

export default CourseDetail;
