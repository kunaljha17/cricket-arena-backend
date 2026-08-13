const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  registrationDeadline: {
    type: Date,
  },
  entryFee: {
    type: Number,
  },
  maxTeams: {
    type: Number,
  },
  registeredTeams: {
    type: Number,
    default: 0,
  },
  prizePool: {
    type: Number,
  },
  format: {
    type: String,
    default: 'knockout', // knockout, league, round_robin
  },
  status: {
    type: String,
    default: 'upcoming', // upcoming, ongoing, completed
  },
  imageUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tournament', tournamentSchema);
