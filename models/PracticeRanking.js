const mongoose = require('mongoose');

const practiceRankingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalOvers: {
    type: Number,
    default: 0,
  },
  totalAppointments: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  lastPracticeDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PracticeRanking', practiceRankingSchema);
