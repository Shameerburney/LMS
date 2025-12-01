import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Bell, Moon, Sun, LogOut, X, RefreshCw } from 'lucide-react';
import dbService from '../../services/db';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const allNotifications = await dbService.getAll('notifications');
      const userNotifications = allNotifications
        .filter(n => n.userId === user.id)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notification = await dbService.get('notifications', notificationId);
      if (notification) {
        await dbService.update('notifications', notificationId, { ...notification, read: true });
        loadNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-content">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search courses, lessons, topics..."
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="notification-container">
            <button
              className="icon-btn"
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <div className="header-actions-sm">
                    <button
                      className="close-btn"
                      onClick={loadNotifications}
                      title="Refresh"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      className="close-btn"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="empty-notifications">
                      <Bell size={32} />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="icon-btn" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          padding: var(--space-4) var(--space-6);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          max-width: 1400px;
          margin: 0 auto;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
        }

        .search-input {
          width: 100%;
          padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
          background: var(--bg-secondary);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-size: var(--text-sm);
          transition: all var(--transition-base);
        }

        .search-input:focus {
          outline: none;
          background: var(--bg-primary);
          border-color: var(--primary-500);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .icon-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          background: var(--error);
          color: white;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-container {
          position: relative;
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 380px;
          max-height: 500px;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          z-index: var(--z-dropdown);
          overflow: hidden;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          border-bottom: 1px solid var(--border);
        }

        .header-actions-sm {
            display: flex;
            gap: var(--space-2);
        }

        .notification-header h3 {
          margin: 0;
          font-size: var(--text-base);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .empty-notifications {
          text-align: center;
          padding: var(--space-12);
          color: var(--text-secondary);
        }

        .empty-notifications svg {
          color: var(--text-tertiary);
          margin-bottom: var(--space-3);
        }

        .notification-item {
          padding: var(--space-4);
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .notification-item:hover {
          background: var(--bg-secondary);
        }

        .notification-item.unread {
          background: rgba(99, 102, 241, 0.05);
          border-left: 3px solid var(--primary-500);
        }

        .notification-content h4 {
          margin: 0 0 var(--space-1) 0;
          font-size: var(--text-sm);
          font-weight: 600;
        }

        .notification-content p {
          margin: 0 0 var(--space-2) 0;
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .notification-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        @media (max-width: 768px) {
          .header {
            padding: var(--space-3) var(--space-4);
          }

          .search-container {
            max-width: none;
          }

          .search-input {
            font-size: var(--text-xs);
          }

          .notification-dropdown {
            width: 320px;
          }
        }

        @media (max-width: 640px) {
          .search-container {
            display: none;
          }

          .notification-dropdown {
            position: fixed;
            top: 60px;
            left: var(--space-4);
            right: var(--space-4);
            width: auto;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
