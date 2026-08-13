const express = require('express');
const router = express.Router();
const {
  getTournaments,
  getTournamentById,
  createTournament,
  registerForTournament,
  updateTournament,
  deleteTournament,
} = require('../controllers/tournamentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTournaments)
  .post(protect, adminOnly, createTournament);

router.route('/:id')
  .get(getTournamentById)
  .put(protect, adminOnly, updateTournament)
  .delete(protect, adminOnly, deleteTournament);

router.post('/:id/register', protect, registerForTournament);

module.exports = router;
