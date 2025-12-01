import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courses';
import { Search, Filter, Star, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/constants';

const CourseLibrary = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [courses, selectedCategory, selectedDifficulty, searchQuery]);

    const loadCourses = async () => {
        try {
            const allCourses = await courseService.getAllCourses();
            setCourses(allCourses);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = courses;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter((c) => c.category === selectedCategory);
        }

        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter((c) => c.difficulty === selectedDifficulty);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (c) =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredCourses(filtered);
    };

    const handleEnroll = async (courseId) => {
        try {
            await courseService.enrollInCourse(user.id, courseId);
            loadCourses();
        } catch (error) {
            console.error('Error enrolling:', error);
        }
    };

    const isEnrolled = (courseId) => {
        const course = courses.find((c) => c.id === courseId);
        return course?.enrolledStudents.includes(user.id);
    };

    if (loading) {
        return <div className="loading">Loading courses...</div>;
    }

    return (
        <div className="course-library">
            <div className="library-header">
                <div>
                    <h1>Course Library</h1>
                    <p>Explore our comprehensive collection of AI and Data Science courses</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={18} />
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="All">All Categories</option>
                        {Object.values(CATEGORIES).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                        <option value="All">All Levels</option>
                        {Object.values(DIFFICULTY_LEVELS).map((level) => (
                            <option key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
                <p>
                    Showing <strong>{filteredCourses.length}</strong> courses
                </p>
            </div>

            {/* Courses Grid */}
            <div className="courses-grid">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="course-card">
                        <div className="course-thumbnail">
                            <img src={course.thumbnail} alt={course.title} />
                            <div className="difficulty-badge">{course.difficulty}</div>
                            {isEnrolled(course.id) && (
                                <div className="enrolled-badge">
                                    <BookOpen size={14} />
                                    Enrolled
                                </div>
                            )}
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
                            <p className="course-description">{course.description.substring(0, 120)}...</p>

                            <div className="course-stats">
                                <span>
                                    <Clock size={14} />
                                    {course.duration}h
                                </span>
                                <span>
                                    <TrendingUp size={14} />
                                    {course.enrolledStudents.length} students
                                </span>
                            </div>

                            <div className="course-footer">
                                {isEnrolled(course.id) ? (
                                    <Link to={`/course/${course.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                                        Continue Learning
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleEnroll(course.id)}
                                        className="btn btn-outline"
                                        style={{ width: '100%' }}
                                    >
                                        Enroll Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="no-results">
                    <p>No courses found matching your criteria.</p>
                </div>
            )}

            <style jsx>{`
        .course-library {
          max-width: 1400px;
          margin: 0 auto;
        }

        .library-header {
          margin-bottom: var(--space-8);
        }

        .library-header h1 {
          margin-bottom: var(--space-2);
        }

        .library-header p {
          color: var(--text-secondary);
          font-size: var(--text-lg);
        }

        .filters-section {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--bg-secondary);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: var(--text-base);
          outline: none;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .filter-group select {
          padding: var(--space-3) var(--space-4);
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: var(--text-sm);
          cursor: pointer;
        }

        .results-info {
          margin-bottom: var(--space-6);
          color: var(--text-secondary);
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
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-500);
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

        .enrolled-badge {
          position: absolute;
          top: var(--space-3);
          left: var(--space-3);
          background: var(--success);
          color: white;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: var(--space-1);
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

        .course-stats {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .course-stats span {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .no-results {
          text-align: center;
          padding: var(--space-12);
          color: var(--text-secondary);
        }

        .loading {
          text-align: center;
          padding: var(--space-12);
          font-size: var(--text-lg);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
          }

          .search-box {
            min-width: auto;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default CourseLibrary;
