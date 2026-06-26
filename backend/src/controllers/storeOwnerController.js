const { Store, Rating, User } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [{
        model: Rating,
        as: 'ratings',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        }],
      }],
    });

    if (!store) {
      return res.json({ store: null, averageRating: null, ratings: [] });
    }

    const ratings = store.ratings.map((r) => ({
      id: r.id,
      rating: r.rating,
      userName: r.user.name,
      userEmail: r.user.email,
      createdAt: r.createdAt,
    }));

    let averageRating = null;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      averageRating = parseFloat((sum / ratings.length).toFixed(2));
    }

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
