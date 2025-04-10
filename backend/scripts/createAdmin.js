const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@gmail.com' });
    console.log('Deleted existing admin user if any');

    console.log('Creating admin user...');
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully with following details:');
    console.log({
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to MongoDB. Please check if MongoDB is running.');
    }
    process.exit(1);
  }
};

createAdmin(); 