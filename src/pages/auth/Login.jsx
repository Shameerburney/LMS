import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
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
                        <LogIn size={40} />
                    </div>
                    <h1>Welcome Back!</h1>
                    <p>Sign in to continue your learning journey</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <Mail size={18} />
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="password"
                            className="input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Create one now
                        </Link>
                    </p>
                </div>

                <div className="demo-credentials">
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-6)' }}>
                        <strong>Demo Accounts:</strong><br />
                        Student: student@demo.com / password<br />
                        Instructor: instructor@demo.com / password<br />
                        Admin: admin@demo.com / password
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
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--accent-500) 100%);
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
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .auth-header h1 {
          margin-bottom: var(--space-2);
          background: linear-gradient(135deg, var(--primary-600), var(--accent-600));
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
          gap: var(--space-6);
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

        .demo-credentials {
          text-align: center;
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-top: var(--space-6);
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

export default Login;
