import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { Store, Plus, X, Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './Admin.css';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const fetchStores = useCallback(async () => {
    try {
      const response = await adminAPI.getStores({ ...filters, sortBy, sortOrder });
      setStores(response.data);
    } catch (err) {
      console.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

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
    if (formData.address.length > 400) errs.address = 'Address max 400 characters';
    if (!formData.ownerId || isNaN(formData.ownerId)) errs.ownerId = 'Valid Owner ID required';
    return errs;
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    try {
      await adminAPI.createStore({ ...formData, ownerId: parseInt(formData.ownerId) });
      setShowCreateForm(false);
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      setFormErrors({});
      fetchStores();
    } catch (err) {
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach((e) => { serverErrors[e.path] = e.msg; });
        setFormErrors(serverErrors);
      } else {
        setServerError(err.response?.data?.message || 'Failed to create store');
      }
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span>Loading stores...</span>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            <div className="page-header-icon stat-icon-stores">
              <Store size={20} />
            </div>
            Stores
          </h1>
          <p className="page-subtitle">{stores.length} stores registered</p>
        </div>
        <button
          className={showCreateForm ? 'btn-secondary' : 'btn-add'}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Store</>}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-card">
          <h3>Create New Store</h3>
          {serverError && <div className="alert alert-error">{serverError}</div>}
          <form onSubmit={handleCreateStore}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Store Name <span className="form-hint">(20-60 chars)</span></label>
                <input type="text" className={`form-input ${formErrors.name ? 'error' : ''}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required minLength={20} maxLength={60} placeholder="Enter store name" />
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className={`form-input ${formErrors.email ? 'error' : ''}`} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="store@example.com" />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Owner ID <span className="form-hint">(User ID)</span></label>
                <input type="number" className={`form-input ${formErrors.ownerId ? 'error' : ''}`} value={formData.ownerId} onChange={(e) => setFormData({...formData, ownerId: e.target.value})} required placeholder="Enter owner user ID" />
                {formErrors.ownerId && <span className="field-error">{formErrors.ownerId}</span>}
              </div>
              <div className="form-group" />
            </div>
            <div className="form-group">
              <label className="form-label">Address <span className="form-hint">(max 400 chars)</span></label>
              <textarea className={`form-input ${formErrors.address ? 'error' : ''}`} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required maxLength={400} rows={2} placeholder="Enter store address" />
              {formErrors.address && <span className="field-error">{formErrors.address}</span>}
            </div>
            <button type="submit" className="btn-primary" style={{ maxWidth: 200 }}>Create Store</button>
          </form>
        </div>
      )}

      <div className="filters-bar">
        <input className="filter-input" placeholder="Search by name..." value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} />
        <input className="filter-input" placeholder="Search by email..." value={filters.email} onChange={(e) => setFilters({...filters, email: e.target.value})} />
        <input className="filter-input" placeholder="Search by address..." value={filters.address} onChange={(e) => setFilters({...filters, address: e.target.value})} />
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={`sortable ${sortBy === 'name' ? 'active' : ''}`}>Name <span className="sort-icon"><SortIcon field="name" /></span></th>
              <th onClick={() => handleSort('email')} className={`sortable ${sortBy === 'email' ? 'active' : ''}`}>Email <span className="sort-icon"><SortIcon field="email" /></span></th>
              <th>Address</th>
              <th onClick={() => handleSort('rating')} className={`sortable ${sortBy === 'rating' ? 'active' : ''}`}>Rating <span className="sort-icon"><SortIcon field="rating" /></span></th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr><td colSpan="4" className="no-data">No stores found</td></tr>
            ) : (
              stores.map((store) => (
                <tr key={store.id}>
                  <td style={{ fontWeight: 500 }}>{store.name}</td>
                  <td className="cell-muted">{store.email}</td>
                  <td className="cell-muted">{store.address}</td>
                  <td>
                    {store.overallRating !== null ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, color: 'var(--amber)' }}>
                        <Star size={14} fill="currentColor" /> {store.overallRating}
                      </span>
                    ) : (
                      <span className="cell-muted" style={{ fontStyle: 'italic' }}>No ratings</span>
                    )}
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

export default StoreList;
