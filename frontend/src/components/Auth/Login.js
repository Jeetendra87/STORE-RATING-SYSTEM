import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, ShieldCheck, BarChart3, Users } from 'lucide-react';
import './Auth.css';

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
      const user = await login(email, password);
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'store_owner':
          navigate('/store-owner/dashboard');
          break;
        default:
          navigate('/user/stores');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-content">
          <div className="brand-icon">
            <Star size={36} />
          </div>
          <h1>StoreRate</h1>
          <p>Your trusted platform for honest store ratings and reviews.</p>
          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon"><ShieldCheck size={20} /></div>
              <span>Verified & authentic ratings</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><BarChart3 size={20} /></div>
              <span>Real-time analytics dashboard</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><Users size={20} /></div>
              <span>Multi-role access control</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
