const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, address, role: role || 'user' });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else {
      order.push(['name', 'ASC']);
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role'],
      order,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = { ...user.toJSON() };

    if (user.role === 'store_owner') {
      const store = await Store.findOne({
        where: { ownerId: user.id },
        include: [{
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        }],
      });

      if (store && store.ratings.length > 0) {
        const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
        result.rating = parseFloat((sum / store.ratings.length).toFixed(2));
      } else {
        result.rating = null;
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const order = [];
    if (sortBy && sortBy !== 'rating') {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else if (!sortBy) {
      order.push(['name', 'ASC']);
    }

    const stores = await Store.findAll({
      where,
      include: [{
        model: Rating,
        as: 'ratings',
        attributes: ['rating'],
      }],
      order,
    });

    const storesWithRating = stores.map((store) => {
      const s = store.toJSON();
      if (s.ratings.length > 0) {
        const sum = s.ratings.reduce((acc, r) => acc + r.rating, 0);
        s.overallRating = parseFloat((sum / s.ratings.length).toFixed(2));
      } else {
        s.overallRating = null;
      }
      delete s.ratings;
      return s;
    });

    if (sortBy === 'rating') {
      storesWithRating.sort((a, b) => {
        const aR = a.overallRating || 0;
        const bR = b.overallRating || 0;
        return sortOrder === 'desc' ? bR - aR : aR - bR;
      });
    }

    res.json(storesWithRating);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'Owner user not found' });
    }

    if (owner.role !== 'store_owner') {
      await owner.update({ role: 'store_owner' });
    }

    const store = await Store.create({ name, email, address, ownerId });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
