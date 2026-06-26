const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

exports.getStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const order = [];
    if (sortBy && sortBy !== 'rating' && sortBy !== 'userRating') {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else if (!sortBy) {
      order.push(['name', 'ASC']);
    }

    const stores = await Store.findAll({
      where,
      include: [{
        model: Rating,
        as: 'ratings',
        attributes: ['rating', 'userId'],
      }],
      order,
    });

    const storesWithRating = stores.map((store) => {
      const s = store.toJSON();
      const userRating = s.ratings.find((r) => r.userId === userId);
      if (s.ratings.length > 0) {
        const sum = s.ratings.reduce((acc, r) => acc + r.rating, 0);
        s.overallRating = parseFloat((sum / s.ratings.length).toFixed(2));
      } else {
        s.overallRating = null;
      }
      s.userRating = userRating ? userRating.rating : null;
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

exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId, storeId: parseInt(storeId) },
      defaults: { rating, userId, storeId: parseInt(storeId) },
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.json({ message: created ? 'Rating submitted' : 'Rating updated', rating: ratingRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
