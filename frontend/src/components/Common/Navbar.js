import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Store,
  KeyRound,
  LogOut,
  Star,
} from 'lucide-react';
import './Navbar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname.startsWith(path);

  const roleLabel = {
    admin: 'Administrator',
    user: 'User',
    store_owner: 'Store Owner',
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Star size={20} />
          </div>
          <div className="logo-text">
            <span className="logo-title">StoreRate</span>
            <span className="logo-subtitle">Rating Platform</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-label">Menu</span>

          {user.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                <Users size={18} />
                <span>Users</span>
              </Link>
              <Link to="/admin/stores" className={`nav-link ${isActive('/admin/stores') ? 'active' : ''}`}>
                <Store size={18} />
                <span>Stores</span>
              </Link>
            </>
          )}

          {user.role === 'user' && (
            <Link to="/user/stores" className={`nav-link ${isActive('/user/stores') ? 'active' : ''}`}>
              <Store size={18} />
              <span>Stores</span>
            </Link>
          )}

          {user.role === 'store_owner' && (
            <Link to="/store-owner/dashboard" className={`nav-link ${isActive('/store-owner') ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        <div className="nav-section">
          <span className="nav-section-label">Account</span>
          <Link to="/change-password" className={`nav-link ${isActive('/change-password') ? 'active' : ''}`}>
            <KeyRound size={18} />
            <span>Change Password</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name?.split(' ').slice(0, 2).join(' ')}</span>
            <span className="user-role">{roleLabel[user.role]}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
