import React, { useState, useEffect } from 'react';
import { storeOwnerAPI } from '../../services/api';
import { LayoutDashboard, Store, Mail, MapPin, Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './StoreOwner.css';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState({ store: null, averageRating: null, ratings: [] });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('userName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await storeOwnerAPI.getDashboard();
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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

  const sortedRatings = [...data.ratings].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span>Loading dashboard...</span>
    </div>
  );

  if (!data.store) {
    return (
      <div>
        <div className="owner-header">
          <h1>
            <div className="owner-header-icon">
              <LayoutDashboard size={20} />
            </div>
            Store Dashboard
          </h1>
        </div>
        <div className="no-store-card">
          <Store size={44} strokeWidth={1.5} />
          <p>No store is associated with your account yet.</p>
        </div>
      </div>
    );
  }

  const avgRating = data.averageRating ? parseFloat(data.averageRating) : 0;
  const fullStars = Math.floor(avgRating);

  return (
    <div>
      <div className="owner-header">
        <h1>
          <div className="owner-header-icon">
            <LayoutDashboard size={20} />
          </div>
          Store Dashboard
        </h1>
        <p>Monitor your store's performance and ratings</p>
      </div>

      <div className="owner-stats">
        <div className="owner-stat-card">
          <div className="owner-stat-label">
            <Store size={15} /> Store Information
          </div>
          <div className="store-name-display">{data.store.name}</div>
          <div className="store-detail-row">
            <Mail size={14} />
            <span>{data.store.email}</span>
          </div>
          <div className="store-detail-row">
            <MapPin size={14} />
            <span>{data.store.address}</span>
          </div>
        </div>

        <div className="owner-stat-card">
          <div className="owner-stat-label">
            <Star size={15} /> Average Rating
          </div>
          {data.averageRating !== null ? (
            <>
              <div className="avg-rating-value">
                {data.averageRating}
                <span className="avg-rating-suffix">/ 5</span>
              </div>
              <div className="avg-rating-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className={i <= fullStars ? 'star-filled' : 'star-empty'}>★</span>
                ))}
              </div>
              <div className="rating-count">
                {data.ratings.length} total rating{data.ratings.length !== 1 ? 's' : ''}
              </div>
            </>
          ) : (
            <div className="no-ratings-text">No ratings yet</div>
          )}
        </div>
      </div>

      <div className="ratings-section">
        <div className="ratings-section-header">
          <h2>User Ratings</h2>
          <span className="ratings-count-badge">{data.ratings.length}</span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('userName')} className={`sortable ${sortBy === 'userName' ? 'active' : ''}`}>User Name <span className="sort-icon"><SortIcon field="userName" /></span></th>
                <th onClick={() => handleSort('userEmail')} className={`sortable ${sortBy === 'userEmail' ? 'active' : ''}`}>Email <span className="sort-icon"><SortIcon field="userEmail" /></span></th>
                <th onClick={() => handleSort('rating')} className={`sortable ${sortBy === 'rating' ? 'active' : ''}`}>Rating <span className="sort-icon"><SortIcon field="rating" /></span></th>
                <th onClick={() => handleSort('createdAt')} className={`sortable ${sortBy === 'createdAt' ? 'active' : ''}`}>Date <span className="sort-icon"><SortIcon field="createdAt" /></span></th>
              </tr>
            </thead>
            <tbody>
              {sortedRatings.length === 0 ? (
                <tr><td colSpan="4" className="no-data">No ratings submitted yet</td></tr>
              ) : (
                sortedRatings.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.userName}</td>
                    <td className="cell-muted">{r.userEmail}</td>
                    <td>
                      <span className="rating-stars-display">
                        {'★'.repeat(r.rating)}
                        <span className="rating-stars-empty">{'★'.repeat(5 - r.rating)}</span>
                      </span>
                    </td>
                    <td className="cell-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
