const express = require('express');
const router = express.Router();
const {
  getBowlerPricing,
  createBowlerPricing,
  getGroundPricing,
  createGroundPricing,
} = require('../controllers/pricingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/bowler', getBowlerPricing);
router.post('/bowler', protect, adminOnly, createBowlerPricing);

router.get('/ground', getGroundPricing);
router.post('/ground', protect, adminOnly, createGroundPricing);

module.exports = router;
