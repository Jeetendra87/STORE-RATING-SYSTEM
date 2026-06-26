import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { KeyRound } from 'lucide-react';
import './Auth.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      errs.newPassword = 'Password must be 8-16 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      errs.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
      errs.newPassword = 'Password must contain at least one special character';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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
    setMessage('');
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <KeyRound size={20} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Change Password
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: 52 }}>
          Update your password to keep your account secure
        </p>
      </div>

      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border)'
      }}>
        {message && <div className="alert alert-success">{message}</div>}
        {errors.server && <div className="alert alert-error">{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="form-input"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Enter current password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              New Password <span className="form-hint">(8-16 chars, 1 uppercase, 1 special)</span>
            </label>
            <input
              type="password"
              name="newPassword"
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              minLength={8}
              maxLength={16}
            />
            {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
