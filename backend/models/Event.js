const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['birthday', 'wedding', 'anniversary', 'corporate', 'other']
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  packages: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: String,
    features: [String],
    capacity: Number,
    duration: String
  }],
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema); 