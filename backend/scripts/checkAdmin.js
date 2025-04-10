const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      console.log('Admin user does not exist');
    } else {
      console.log('Admin user found:', {
        name: admin.name,
        email: admin.email,
        role: admin.role,
        _id: admin._id
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error.message);
    process.exit(1);
  }
};

checkAdmin(); 