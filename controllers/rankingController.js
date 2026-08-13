const PracticeRanking = require('../models/PracticeRanking');

// @desc    Get practice rankings / leaderboards
// @route   GET /api/rankings
const getRankings = async (req, res) => {
  try {
    const rankings = await PracticeRanking.find()
      .populate('userId', 'name email')
      .sort({ totalOvers: -1, totalAppointments: -1 });

    const formattedRankings = rankings.map((rankItem, index) => ({
      id: rankItem._id,
      userId: rankItem.userId ? rankItem.userId._id : null,
      userName: rankItem.userId ? rankItem.userId.name : 'Unknown Player',
      totalOvers: rankItem.totalOvers,
      totalAppointments: rankItem.totalAppointments,
      rank: index + 1,
      lastPracticeDate: rankItem.lastPracticeDate,
    }));

    res.json({ rankings: formattedRankings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRankings,
};
