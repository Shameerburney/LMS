import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courses';
import { PlusCircle, BookOpen, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const allCourses = await courseService.getAllCourses();
      const myCourses = allCourses.filter((c) => c.instructor === user.id);
      setCourses(myCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.updateCourse(courseId, { published: false });
        loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'My Courses',
      value: courses.length,
      color: 'var(--primary-500)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: courses.reduce((sum, c) => sum + c.enrolledStudents.length, 0),
      color: 'var(--accent-500)',
      bgColor: 'rgba(20, 184, 166, 0.1)',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Rating',
      value: courses.length > 0
        ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
        : '0.0',
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  if (loading) {
    return <div className="loading">Loading instructor dashboard...</div>;
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Instructor Dashboard</h1>
          <p>Manage your courses and track student progress</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/instructor/create-course" className="btn btn-primary">
            <PlusCircle size={20} />
            Create Course
          </Link>
          <Link to="/instructor/create-quiz" className="btn btn-outline">
            <PlusCircle size={20} />
            Create Quiz
          </Link>
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

      {/* My Courses */}
      <section className="section">
        <h2>My Courses</h2>
        {courses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <h3>No courses yet</h3>
            <p>Create your first course to get started!</p>
            <Link to="/instructor/create-course" className="btn btn-primary">
              <PlusCircle size={20} />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="course-stats-overlay">
                    <span>{course.enrolledStudents.length} students</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>
                <div className="course-content">
                  <span className="badge badge-primary">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description.substring(0, 100)}...</p>
                  <div className="course-actions">
                    <Link to={`/course/${course.id}`} className="btn btn-sm btn-outline">
                      View
                    </Link>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="btn btn-sm btn-ghost"
                      style={{ color: 'var(--error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .instructor-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading {
          text-align: center;
          padding: var(--space-12);
          font-size: var(--text-lg);
          color: var(--text-secondary);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-8);
        }

        .dashboard-header h1 {
          margin-bottom: var(--space-2);
        }

        .dashboard-header p {
          color: var(--text-secondary);
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
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .section h2 {
          margin-bottom: var(--space-6);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-12);
          color: var(--text-secondary);
        }

        .empty-state svg {
          color: var(--text-tertiary);
          margin-bottom: var(--space-4);
        }

        .empty-state h3 {
          margin-bottom: var(--space-2);
          color: var(--text-primary);
        }

        .empty-state p {
          margin-bottom: var(--space-6);
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
        }

        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .course-thumbnail {
          position: relative;
          width: 100%;
          height: 180px;
        }

        .course-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-stats-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: var(--space-3);
          display: flex;
          justify-content: space-between;
          color: white;
          font-size: var(--text-sm);
        }

        .course-content {
          padding: var(--space-5);
        }

        .course-content h3 {
          margin: var(--space-3) 0;
          font-size: var(--text-lg);
        }

        .course-content p {
          color: var(--text-secondary);
          font-size: var(--text-sm);
          margin-bottom: var(--space-4);
        }

        .course-actions {
          display: flex;
          gap: var(--space-3);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: var(--space-4);
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default InstructorDashboard;
