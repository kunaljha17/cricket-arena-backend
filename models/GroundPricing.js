const mongoose = require('mongoose');

const groundPricingSchema = new mongoose.Schema({
  groundSize: {
    type: String,
    enum: ['1_person', '2_person', '4_person', '6_person', 'full_ground'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  maxPlayers: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('GroundPricing', groundPricingSchema);
