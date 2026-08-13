const mongoose = require('mongoose');

const bowlerMachinePricingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pricePerOver: {
    type: Number,
    required: true,
  },
  pricePerSession: {
    type: Number,
    required: true,
  },
  sessionDuration: {
    type: Number,
    default: 60, // in minutes
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BowlerMachinePricing', bowlerMachinePricingSchema);
