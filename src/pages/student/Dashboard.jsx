import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courses';
import QuizNotification from '../../components/notifications/QuizNotification';
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Star,
  Play,
  Target,
  Flame,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await courseService.initializeSampleData();
      const allCourses = await courseService.getAllCourses();
      setCourses(allCourses);

      const enrolled = allCourses.filter((c) =>
        c.enrolledStudents.includes(user.id)
      );
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      color: 'var(--primary-500)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Progress',
      value: '45%',
      color: 'var(--accent-500)',
      bgColor: 'rgba(20, 184, 166, 0.1)',
    },
    {
      icon: Award,
      label: 'Certificates',
      value: '0',
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: user?.gamification?.streak || 0,
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Quiz Notifications */}
      <QuizNotification />

      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h1>Welcome back, {user?.profile?.name}! 👋</h1>
          <p>Ready to continue your learning journey?</p>
        </div>
        <div className="level-badge">
          <Target size={24} />
          <div>
            <div className="level-text">Level {user?.gamification?.level || 1}</div>
            <div className="xp-text">{user?.gamification?.xp || 0} XP</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Continue Learning</h2>
            <Link to="/courses" className="see-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="courses-grid">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="course-overlay">
                    <button className="play-btn">
                      <Play size={24} fill="white" />
                    </button>
                  </div>
                </div>
                <div className="course-content">
                  <div className="course-meta">
                    <span className="badge badge-primary">{course.category}</span>
                    <span className="course-rating">
                      <Star size={14} fill="var(--warning)" stroke="var(--warning)" />
                      {course.rating}
                    </span>
                  </div>
                  <h3>{course.title}</h3>
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '35%' }} />
                    </div>
                    <span className="progress-text">35% Complete</span>
                  </div>
                  <div className="course-footer">
                    <span className="course-duration">
                      <Clock size={14} />
                      {course.duration}h
                    </span>
                    <Link to={`/course/${course.id}`} className="btn btn-sm btn-primary">
                      Continue
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Courses */}
      <section className="section">
        <div className="section-header">
          <h2>Recommended for You</h2>
          <Link to="/courses" className="see-all">
            Explore All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="courses-grid">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                <img src={course.thumbnail} alt={course.title} />
                <div className="difficulty-badge">{course.difficulty}</div>
              </div>
              <div className="course-content">
                <div className="course-meta">
                  <span className="badge badge-primary">{course.category}</span>
                  <span className="course-rating">
                    <Star size={14} fill="var(--warning)" stroke="var(--warning)" />
                    {course.rating}
                  </span>
                </div>
                <h3>{course.title}</h3>
                <p className="course-description">{course.description.substring(0, 100)}...</p>
                <div className="course-footer">
                  <span className="course-duration">
                    <Clock size={14} />
                    {course.duration}h
                  </span>
                  <Link to={`/course/${course.id}`} className="btn btn-sm btn-outline">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          font-size: var(--text-lg);
          color: var(--text-secondary);
        }

        .welcome-section {
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          margin-bottom: var(--space-8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          animation: fadeIn 0.5s ease-out;
        }

        .welcome-section h1 {
          color: white;
          margin-bottom: var(--space-2);
        }

        .welcome-section p {
          color: rgba(255, 255, 255, 0.9);
          font-size: var(--text-lg);
        }

        .level-badge {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: rgba(255, 255, 255, 0.2);
          padding: var(--space-4) var(--space-6);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(10px);
        }

        .level-text {
          font-size: var(--text-xl);
          font-weight: 700;
        }

        .xp-text {
          font-size: var(--text-sm);
          opacity: 0.9;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .stat-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          transition: all var(--transition-base);
          animation: fadeIn 0.5s ease-out;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-heading);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .section {
          margin-bottom: var(--space-10);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .section-header h2 {
          margin: 0;
        }

        .see-all {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--primary-500);
          font-weight: 600;
          text-decoration: none;
          transition: gap var(--transition-fast);
        }

        .see-all:hover {
          gap: var(--space-3);
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-6);
        }

        .course-card {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-base);
          animation: fadeIn 0.5s ease-out;
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-500);
        }

        .course-thumbnail {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .course-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-base);
        }

        .course-card:hover .course-overlay {
          opacity: 1;
        }

        .play-btn {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          background: var(--primary-500);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform var(--transition-base);
        }

        .play-btn:hover {
          transform: scale(1.1);
        }

        .difficulty-badge {
          position: absolute;
          top: var(--space-3);
          right: var(--space-3);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: capitalize;
          backdrop-filter: blur(4px);
        }

        .course-content {
          padding: var(--space-5);
        }

        .course-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .course-rating {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-weight: 600;
          color: var(--text-primary);
        }

        .course-content h3 {
          font-size: var(--text-lg);
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .course-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
          line-height: var(--leading-relaxed);
        }

        .course-progress {
          margin-bottom: var(--space-4);
        }

        .progress-text {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-top: var(--space-2);
          display: block;
        }

        .course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .course-duration {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .welcome-section {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
