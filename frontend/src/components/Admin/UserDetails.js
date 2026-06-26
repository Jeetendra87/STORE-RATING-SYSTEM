import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { ArrowLeft } from 'lucide-react';
import './Admin.css';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminAPI.getUserDetails(id);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span>Loading user details...</span>
    </div>
  );

  if (!user) return (
    <div>
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>
      <div className="detail-card">
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>User not found</p>
      </div>
    </div>
  );

  return (
    <div>
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Users
      </button>

      <div className="detail-card">
        <h2>User Details</h2>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Name</label>
            <p>{user.name}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div className="detail-item">
            <label>Address</label>
            <p>{user.address}</p>
          </div>
          <div className="detail-item">
            <label>Role</label>
            <p><span className={`role-badge role-${user.role}`}>{user.role === 'store_owner' ? 'Store Owner' : user.role}</span></p>
          </div>
          {user.role === 'store_owner' && (
            <div className="detail-item">
              <label>Store Rating</label>
              <p className="rating-display">{user.rating !== null ? `${user.rating} / 5` : 'No ratings yet'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
