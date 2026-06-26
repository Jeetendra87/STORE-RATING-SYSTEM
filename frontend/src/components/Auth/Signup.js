import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (formData.name.length < 20 || formData.name.length > 60) {
      errs.name = 'Name must be between 20 and 60 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errs.email = 'Must be a valid email address';
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      errs.password = 'Password must be 8-16 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      errs.password = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errs.password = 'Password must contain at least one special character';
    }
    if (formData.address.length > 400) {
      errs.address = 'Address must not exceed 400 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      navigate('/user/stores');
    } catch (err) {
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach((e) => {
          serverErrors[e.path] = e.msg;
        });
        setErrors(serverErrors);
      } else {
        setServerError(err.response?.data?.message || 'Signup failed');
      }
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
          <p>Join our community and start rating your favorite stores today.</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2>Create account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="form-hint">(20-60 characters)</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                minLength={20}
                maxLength={60}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                Password <span className="form-hint">(8-16 chars, 1 uppercase, 1 special)</span>
              </label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                minLength={8}
                maxLength={16}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                Address <span className="form-hint">(max 400 characters)</span>
              </label>
              <textarea
                name="address"
                className={`form-input ${errors.address ? 'error' : ''}`}
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
                maxLength={400}
                rows={3}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
