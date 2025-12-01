import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import dbService from '../../services/db';
import { Users, BookOpen, TrendingUp, Settings, Trash2, Edit, Shield } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const allUsers = await dbService.getAll('users');
            const allCourses = await dbService.getAll('courses');
            setUsers(allUsers);
            setCourses(allCourses);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (userId === user.id) {
            alert("You cannot delete your own account!");
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await dbService.delete('users', userId);
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const deleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await dbService.delete('courses', courseId);
                loadData();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const changeUserRole = async (userId, newRole) => {
        try {
            const userToUpdate = await dbService.get('users', userId);
            userToUpdate.role = newRole;
            userToUpdate.updatedAt = Date.now();
            await dbService.update('users', userToUpdate);
            loadData();
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const toggleSuspend = async (userId) => {
        if (userId === user.id) {
            alert("You cannot suspend your own account!");
            return;
        }
        try {
            const userToUpdate = await dbService.get('users', userId);
            userToUpdate.suspended = !userToUpdate.suspended;
            userToUpdate.updatedAt = Date.now();
            await dbService.update('users', userToUpdate);
            loadData();
            alert(`User ${userToUpdate.suspended ? 'suspended' : 'unsuspended'} successfully!`);
        } catch (error) {
            console.error('Error toggling suspend:', error);
        }
    };

    const stats = [
        {
            icon: Users,
            label: 'Total Users',
            value: users.length,
            color: 'var(--primary-500)',
            bgColor: 'rgba(99, 102, 241, 0.1)',
        },
        {
            icon: BookOpen,
            label: 'Total Courses',
            value: courses.length,
            color: 'var(--accent-500)',
            bgColor: 'rgba(20, 184, 166, 0.1)',
        },
        {
            icon: Shield,
            label: 'Admins',
            value: users.filter(u => u.role === 'admin').length,
            color: 'var(--warning)',
            bgColor: 'rgba(245, 158, 11, 0.1)',
        },
        {
            icon: TrendingUp,
            label: 'Students',
            value: users.filter(u => u.role === 'student').length,
            color: 'var(--success)',
            bgColor: 'rgba(16, 185, 129, 0.1)',
        },
    ];

    if (loading) {
        return <div className="loading">Loading admin dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                Manage users, courses, and system settings
            </p>

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

            {/* User Management */}
            <section className="section">
                <h2>User Management</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className={u.suspended ? 'suspended-row' : ''}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                {u.profile.name.charAt(0).toUpperCase()}
                                            </div>
                                            {u.profile.name}
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            onChange={(e) => changeUserRole(u.id, e.target.value)}
                                            className="role-select"
                                            disabled={u.id === user.id || u.suspended}
                                        >
                                            <option value="student">Student</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${u.suspended ? 'suspended' : 'active'}`}>
                                            {u.suspended ? '🔒 Suspended' : '✅ Active'}
                                        </span>
                                    </td>
                                    <td>{new Date(u.profile.joinedDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => toggleSuspend(u.id)}
                                                className={`btn-icon ${u.suspended ? 'btn-success' : 'btn-warning'}`}
                                                disabled={u.id === user.id}
                                                title={u.suspended ? 'Unsuspend user' : 'Suspend user'}
                                            >
                                                <Shield size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(u.id)}
                                                className="btn-icon btn-danger"
                                                disabled={u.id === user.id}
                                                title="Delete user"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Course Management */}
            <section className="section">
                <h2>Course Management</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Course Title</th>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Enrolled</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td><strong>{course.title}</strong></td>
                                    <td><span className="badge badge-primary">{course.category}</span></td>
                                    <td><span className="badge badge-info">{course.difficulty}</span></td>
                                    <td>{course.enrolledStudents.length} students</td>
                                    <td>⭐ {course.rating}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteCourse(course.id)}
                                            className="btn-icon btn-danger"
                                            title="Delete course"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <style jsx>{`
        .admin-dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading {
          text-align: center;
          padding: var(--space-12);
          font-size: var(--text-lg);
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
          margin-bottom: var(--space-4);
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: var(--space-3);
          background: var(--bg-secondary);
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border);
        }

        .data-table td {
          padding: var(--space-3);
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .data-table tr:hover {
          background: var(--bg-secondary);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .user-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--text-sm);
        }

        .role-select {
          padding: var(--space-2) var(--space-3);
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: var(--text-sm);
          cursor: pointer;
        }

        .role-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          padding: var(--space-2);
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .btn-icon:hover {
          background: var(--bg-secondary);
        }

        .btn-danger {
          color: var(--error);
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .btn-icon:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .action-buttons {
          display: flex;
          gap: var(--space-2);
        }

        .btn-warning {
          color: var(--warning);
        }

        .btn-warning:hover {
          background: rgba(245, 158, 11, 0.1);
        }

        .btn-success {
          color: var(--success);
        }

        .btn-success:hover {
          background: rgba(16, 185, 129, 0.1);
        }

        .status-badge {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        .status-badge.suspended {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .suspended-row {
          opacity: 0.6;
          background: rgba(239, 68, 68, 0.02);
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .table-container {
            overflow-x: scroll;
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

export default AdminDashboard;
