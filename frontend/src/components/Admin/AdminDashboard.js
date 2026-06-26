import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Store, Star, ArrowRight, LayoutDashboard } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span>Loading dashboard...</span>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            <div className="page-header-icon stat-icon-users" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <LayoutDashboard size={20} />
            </div>
            Dashboard
          </h1>
          <p className="page-subtitle">Overview of your platform metrics</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Users</span>
            <div className="stat-card-icon stat-icon-users">
              <Users size={22} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalUsers}</div>
          <Link to="/admin/users" className="stat-card-link">
            View all users <ArrowRight size={14} />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Stores</span>
            <div className="stat-card-icon stat-icon-stores">
              <Store size={22} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalStores}</div>
          <Link to="/admin/stores" className="stat-card-link">
            View all stores <ArrowRight size={14} />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Ratings</span>
            <div className="stat-card-icon stat-icon-ratings">
              <Star size={22} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalRatings}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across all stores</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
