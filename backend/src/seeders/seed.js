const { sequelize, User, Store, Rating } = require('../models');
require('dotenv').config();

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const admin = await User.create({
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      password: 'Admin@1234',
      address: '123 Admin Street, Admin City, Admin State 12345',
      role: 'admin',
    });

    const storeOwner1 = await User.create({
      name: 'Store Owner First Person',
      email: 'owner1@storerating.com',
      password: 'Owner@1234',
      address: '456 Store Avenue, Commerce City, Commerce State 67890',
      role: 'store_owner',
    });

    const storeOwner2 = await User.create({
      name: 'Store Owner Second Person',
      email: 'owner2@storerating.com',
      password: 'Owner@1234',
      address: '789 Business Boulevard, Market Town, Market State 11223',
      role: 'store_owner',
    });

    const normalUser1 = await User.create({
      name: 'Normal User First Person',
      email: 'user1@storerating.com',
      password: 'User@12345',
      address: '321 Residential Lane, Home City, Home State 44556',
      role: 'user',
    });

    const normalUser2 = await User.create({
      name: 'Normal User Second Person',
      email: 'user2@storerating.com',
      password: 'User@12345',
      address: '654 Living Road, Suburb Town, Suburb State 77889',
      role: 'user',
    });

    const store1 = await Store.create({
      name: 'Electronics Mega Store One',
      email: 'electronics@store.com',
      address: '100 Tech Park, Silicon Valley, CA 94025',
      ownerId: storeOwner1.id,
    });

    const store2 = await Store.create({
      name: 'Fashion Boutique Store Two',
      email: 'fashion@store.com',
      address: '200 Fashion Street, New York, NY 10001',
      ownerId: storeOwner2.id,
    });

    const store3 = await Store.create({
      name: 'Grocery Supermarket Store',
      email: 'grocery@store.com',
      address: '300 Market Road, Chicago, IL 60601',
      ownerId: storeOwner1.id,
    });

    await Rating.bulkCreate([
      { userId: normalUser1.id, storeId: store1.id, rating: 4 },
      { userId: normalUser1.id, storeId: store2.id, rating: 5 },
      { userId: normalUser2.id, storeId: store1.id, rating: 3 },
      { userId: normalUser2.id, storeId: store3.id, rating: 4 },
    ]);

    console.log('Seed data created successfully');
    console.log('\n--- Login Credentials ---');
    console.log('Admin: admin@storerating.com / Admin@1234');
    console.log('Store Owner 1: owner1@storerating.com / Owner@1234');
    console.log('Store Owner 2: owner2@storerating.com / Owner@1234');
    console.log('Normal User 1: user1@storerating.com / User@12345');
    console.log('Normal User 2: user2@storerating.com / User@12345');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
