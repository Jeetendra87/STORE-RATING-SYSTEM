import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Users, Plus, X, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './Admin.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await adminAPI.getUsers({ ...filters, sortBy, sortOrder });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown size={13} />;
    return sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  const validateForm = () => {
    const errs = {};
    if (formData.name.length < 20 || formData.name.length > 60) errs.name = 'Name must be 20-60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email';
    if (formData.password.length < 8 || formData.password.length > 16) errs.password = 'Password must be 8-16 characters';
    else if (!/[A-Z]/.test(formData.password)) errs.password = 'Must contain uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) errs.password = 'Must contain special character';
    if (formData.address.length > 400) errs.address = 'Address max 400 characters';
    return errs;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    try {
      await adminAPI.createUser(formData);
      setShowCreateForm(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach((e) => { serverErrors[e.path] = e.msg; });
        setFormErrors(serverErrors);
      } else {
        setServerError(err.response?.data?.message || 'Failed to create user');
      }
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span>Loading users...</span>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            <div className="page-header-icon stat-icon-users">
              <Users size={20} />
            </div>
            Users
          </h1>
          <p className="page-subtitle">{users.length} total users registered</p>
        </div>
        <button
          className={showCreateForm ? 'btn-secondary' : 'btn-add'}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add User</>}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-card">
          <h3>Create New User</h3>
          {serverError && <div className="alert alert-error">{serverError}</div>}
          <form onSubmit={handleCreateUser}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name <span className="form-hint">(20-60 chars)</span></label>
                <input type="text" className={`form-input ${formErrors.name ? 'error' : ''}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required minLength={20} maxLength={60} placeholder="Enter full name" />
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className={`form-input ${formErrors.email ? 'error' : ''}`} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="email@example.com" />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password <span className="form-hint">(8-16 chars)</span></label>
                <input type="password" className={`form-input ${formErrors.password ? 'error' : ''}`} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={8} maxLength={16} placeholder="Create password" />
                {formErrors.password && <span className="field-error">{formErrors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address <span className="form-hint">(max 400 chars)</span></label>
              <textarea className={`form-input ${formErrors.address ? 'error' : ''}`} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required maxLength={400} rows={2} placeholder="Enter address" />
              {formErrors.address && <span className="field-error">{formErrors.address}</span>}
            </div>
            <button type="submit" className="btn-primary" style={{ maxWidth: 200 }}>Create User</button>
          </form>
        </div>
      )}

      <div className="filters-bar">
        <input className="filter-input" placeholder="Search by name..." value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} />
        <input className="filter-input" placeholder="Search by email..." value={filters.email} onChange={(e) => setFilters({...filters, email: e.target.value})} />
        <input className="filter-input" placeholder="Search by address..." value={filters.address} onChange={(e) => setFilters({...filters, address: e.target.value})} />
        <select className="filter-select" value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={`sortable ${sortBy === 'name' ? 'active' : ''}`}>Name <span className="sort-icon"><SortIcon field="name" /></span></th>
              <th onClick={() => handleSort('email')} className={`sortable ${sortBy === 'email' ? 'active' : ''}`}>Email <span className="sort-icon"><SortIcon field="email" /></span></th>
              <th>Address</th>
              <th onClick={() => handleSort('role')} className={`sortable ${sortBy === 'role' ? 'active' : ''}`}>Role <span className="sort-icon"><SortIcon field="role" /></span></th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td className="cell-muted">{user.email}</td>
                  <td className="cell-muted">{user.address}</td>
                  <td><span className={`role-badge role-${user.role}`}>{user.role === 'store_owner' ? 'Store Owner' : user.role}</span></td>
                  <td>
                    <Link to={`/admin/users/${user.id}`} className="btn-view">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
