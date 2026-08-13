const BowlerMachinePricing = require('../models/BowlerMachinePricing');
const GroundPricing = require('../models/GroundPricing');

// @desc    Get all bowler machine pricing
// @route   GET /api/pricing/bowler
const getBowlerPricing = async (req, res) => {
  try {
    const pricing = await BowlerMachinePricing.find({ isActive: true }).sort({ pricePerOver: 1 });
    res.json({ pricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create bowler machine pricing (Admin)
// @route   POST /api/pricing/bowler
const createBowlerPricing = async (req, res) => {
  try {
    const { name, description, pricePerOver, pricePerSession, sessionDuration } = req.body;
    const pricing = await BowlerMachinePricing.create({
      name,
      description,
      pricePerOver,
      pricePerSession,
      sessionDuration: sessionDuration || 60,
    });
    res.status(201).json({ pricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all ground pricing
// @route   GET /api/pricing/ground
const getGroundPricing = async (req, res) => {
  try {
    const pricing = await GroundPricing.find({ isActive: true }).sort({ pricePerHour: 1 });
    res.json({ pricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create ground pricing (Admin)
// @route   POST /api/pricing/ground
const createGroundPricing = async (req, res) => {
  try {
    const { groundSize, name, description, pricePerHour, maxPlayers } = req.body;
    const pricing = await GroundPricing.create({
      groundSize,
      name,
      description,
      pricePerHour,
      maxPlayers,
    });
    res.status(201).json({ pricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBowlerPricing,
  createBowlerPricing,
  getGroundPricing,
  createGroundPricing,
};
