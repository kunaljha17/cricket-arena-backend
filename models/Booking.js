const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['bowler_machine', 'ground'],
    required: true,
  },
  bowlerMachineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BowlerMachinePricing',
    default: null,
  },
  groundPricingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroundPricing',
    default: null,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // in minutes
  },
  numberOfOvers: {
    type: Number,
    default: null,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
