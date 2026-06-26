import React, { useState, useEffect, useCallback } from 'react';
import { storeAPI } from '../../services/api';
import { Store, MapPin, Star, CheckCircle } from 'lucide-react';
import './User.css';

const StarRating = ({ rating, onRate, interactive }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [ratingMessage, setRatingMessage] = useState('');

  const fetchStores = useCallback(async () => {
    try {
      const response = await storeAPI.getStores({ ...search, sortBy, sortOrder });
      setStores(response.data);
    } catch (err) {
      console.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRate = async (storeId, rating) => {
    try {
      const response = await storeAPI.submitRating(storeId, { rating });
      setRatingMessage(response.data.message);
      fetchStores();
      setTimeout(() => setRatingMessage(''), 3000);
    } catch (err) {
      console.error('Failed to submit rating');
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
      {ratingMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle size={18} />
            {ratingMessage}
          </div>
        </div>
      )}

      <div className="stores-header">
        <h1>
          <div className="stores-header-icon">
            <Store size={20} />
          </div>
          Browse Stores
        </h1>
        <p>Discover and rate stores in our community</p>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by store name..."
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          placeholder="Search by address..."
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
      </div>

      {stores.length === 0 ? (
        <div className="store-empty-state">
          <Store size={40} strokeWidth={1.5} />
          <p>No stores found matching your search</p>
        </div>
      ) : (
        <div className="store-cards-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <div className="store-card-header">
                <span className="store-card-name">{store.name}</span>
                {store.overallRating !== null ? (
                  <span className="store-card-overall">
                    <Star size={13} fill="currentColor" />
                    {store.overallRating} / 5
                  </span>
                ) : (
                  <span className="store-card-no-rating">No ratings</span>
                )}
              </div>

              <div className="store-card-address">
                <MapPin size={14} />
                {store.address}
              </div>

              <div className="store-card-divider" />

              <div className="store-card-rating-section">
                <div className="store-card-your-rating">
                  {store.userRating !== null ? (
                    <>Your rating: <strong>{store.userRating}/5</strong></>
                  ) : (
                    'Rate this store'
                  )}
                </div>
                <StarRating
                  rating={store.userRating || 0}
                  onRate={(rating) => handleRate(store.id, rating)}
                  interactive={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStores;
