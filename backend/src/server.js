const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const storeOwnerRoutes = require('./routes/storeOwner');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

let dbReady = null;

const ensureDb = () => {
  if (!dbReady) {
    dbReady = sequelize.authenticate()
      .then(() => sequelize.sync({ alter: true }));
  }
  return dbReady;
};

app.use((req, res, next) => {
  ensureDb()
    .then(() => next())
    .catch((err) => res.status(500).json({ message: 'Database connection failed', error: err.message }));
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
