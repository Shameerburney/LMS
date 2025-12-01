import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  MessageSquare,
  Bell,
  Settings,
  Users,
  PlusCircle,
  BarChart3,
  Menu,
  X,
  Megaphone,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
    { to: '/forum', icon: MessageSquare, label: 'Forum' },
  ];

  const instructorLinks = [
    { to: '/instructor', icon: BarChart3, label: 'Instructor Dashboard' },
    { to: '/instructor/create-course', icon: PlusCircle, label: 'Create Course' },
    { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Settings, label: 'Admin Dashboard' },
    // Announcements link removed from here as it's already in instructorLinks which admins also see
    // or if we want to be explicit:
    { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  ];

  // Filter out duplicate announcements link if user is both admin and instructor (or if logic overlaps)
  // Actually, let's refine the logic.
  // If user is admin, they see adminLinks.
  // If user is instructor, they see instructorLinks.
  // If user is admin, they usually also have access to instructor features?
  // In this app, roles are distinct strings 'student', 'instructor', 'admin'.
  // But the logic below says:
  // ...(user?.role === 'instructor' || user?.role === 'admin' ? instructorLinks : []),
  // This means admins see instructor links.
  // So if 'Announcements' is in instructorLinks, admins see it.
  // So we should NOT put it in adminLinks if we want to avoid duplicates.

  const links = [
    ...studentLinks,
    ...(user?.role === 'instructor' || user?.role === 'admin' ? instructorLinks : []),
    ...(user?.role === 'admin' ? adminLinks.filter(link => link.to !== '/announcements') : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <GraduationCap size={32} />
            <span>AI LMS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? 'nav-link-active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.profile?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <style jsx>{`
        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: var(--space-4);
          left: var(--space-4);
          z-index: var(--z-fixed);
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-2);
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 260px;
          background: var(--bg-primary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: var(--z-sticky);
          transition: transform var(--transition-base);
        }

        .sidebar-header {
          padding: var(--space-6);
          border-bottom: 1px solid var(--border);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--primary-500);
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-4);
          overflow-y: auto;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-2);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--transition-fast);
          font-weight: 500;
        }

        .nav-link:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .nav-link-active {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: white;
        }

        .nav-link-active:hover {
          background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
        }

        .sidebar-footer {
          padding: var(--space-4);
          border-top: 1px solid var(--border);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--text-lg);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .user-role {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .sidebar-overlay {
          display: none;
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: block;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar-open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: calc(var(--z-sticky) - 1);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
