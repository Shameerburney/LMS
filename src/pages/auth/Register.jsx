import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { ROLES } from '../../utils/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.STUDENT,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('[Register] Submitting form with:', formData);
      await register(formData.email, formData.password, formData.name, formData.role);
      console.log('[Register] Registration successful, navigating...');
      navigate('/');
    } catch (err) {
      console.error('[Register] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={40} />
          </div>
          <h1>Join AI Learning Platform</h1>
          <p>Start your journey to master AI and Data Science</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              <User size={18} />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <CheckCircle size={18} />
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="input"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <User size={18} />
              I am a...
            </label>
            <select
              id="role"
              name="role"
              className="input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value={ROLES.STUDENT}>Student</option>
              <option value={ROLES.INSTRUCTOR}>Instructor</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-500) 100%);
        }

        .auth-card {
          background: var(--bg-primary);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-2xl);
          padding: var(--space-10);
          max-width: 480px;
          width: 100%;
          animation: fadeIn 0.5s ease-out;
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .auth-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--space-4);
          background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .auth-header h1 {
          margin-bottom: var(--space-2);
          background: linear-gradient(135deg, var(--secondary-600), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid var(--error);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .auth-footer {
          text-align: center;
          margin-top: var(--space-6);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border);
        }

        .auth-footer p {
          margin: 0;
          color: var(--text-secondary);
        }

        .auth-link {
          color: var(--primary-500);
          font-weight: 600;
          text-decoration: none;
        }

        .auth-link:hover {
          color: var(--primary-600);
          text-decoration: underline;
        }

        select.input {
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .auth-card {
            padding: var(--space-6);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
