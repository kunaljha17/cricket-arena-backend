const Tournament = require('../models/Tournament');
const TournamentRegistration = require('../models/TournamentRegistration');

// @desc    Get all tournaments
// @route   GET /api/tournaments
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ isActive: true }).sort({ startDate: 1 });
    res.json({ tournaments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single tournament details
// @route   GET /api/tournaments/:id
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    const registrations = await TournamentRegistration.find({ tournamentId: req.params.id })
      .populate('userId', 'name email');
    
    res.json({ tournament, registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new tournament (Admin)
// @route   POST /api/tournaments
const createTournament = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      registrationDeadline,
      entryFee,
      maxTeams,
      prizePool,
      format,
      imageUrl,
    } = req.body;

    const tournament = await Tournament.create({
      name,
      description,
      startDate,
      endDate,
      registrationDeadline: registrationDeadline || null,
      entryFee: entryFee || 0,
      maxTeams: maxTeams || 16,
      prizePool: prizePool || 0,
      format: format || 'knockout',
      status: 'upcoming',
      imageUrl: imageUrl || '',
    });

    res.status(201).json({ tournament });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register team for a tournament
// @route   POST /api/tournaments/:id/register
const registerForTournament = async (req, res) => {
  try {
    const { teamName, playerNames } = req.body;
    const tournamentId = req.params.id;

    if (!teamName) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    if (tournament.maxTeams && tournament.registeredTeams >= tournament.maxTeams) {
      return res.status(400).json({ message: 'Tournament is full' });
    }

    const existingReg = await TournamentRegistration.findOne({
      tournamentId,
      userId: req.user._id,
    });

    if (existingReg) {
      return res.status(400).json({ message: 'You have already registered a team for this tournament' });
    }

    const registration = await TournamentRegistration.create({
      tournamentId,
      userId: req.user._id,
      teamName,
      playerNames: playerNames || [],
      paymentStatus: 'completed',
    });

    tournament.registeredTeams += 1;
    await tournament.save();

    res.status(201).json({ registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tournament (Admin)
// @route   PUT /api/tournaments/:id
const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    Object.assign(tournament, req.body);
    await tournament.save();
    res.json({ tournament });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete tournament (Admin)
// @route   DELETE /api/tournaments/:id
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    await tournament.deleteOne();
    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTournaments,
  getTournamentById,
  createTournament,
  registerForTournament,
  updateTournament,
  deleteTournament,
};
