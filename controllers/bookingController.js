const Booking = require('../models/Booking');
const PracticeRanking = require('../models/PracticeRanking');

// @desc    Get user or all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('bowlerMachineId', 'name pricePerOver pricePerSession')
      .populate('groundPricingId', 'name groundSize pricePerHour')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      bookingType,
      bowlerMachineId,
      groundPricingId,
      date,
      duration,
      numberOfOvers,
      totalAmount,
      notes,
    } = req.body;

    if (!bookingType || !date || !duration || !totalAmount) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      bookingType,
      bowlerMachineId: bowlerMachineId || null,
      groundPricingId: groundPricingId || null,
      date,
      duration,
      numberOfOvers: numberOfOvers ? parseInt(numberOfOvers) : null,
      totalAmount,
      status: 'pending',
      notes: notes || '',
    });

    // Update or create practice ranking stats if bowling machine booking
    if (bookingType === 'bowler_machine' && numberOfOvers) {
      let ranking = await PracticeRanking.findOne({ userId: req.user._id });
      if (ranking) {
        ranking.totalOvers += parseInt(numberOfOvers);
        ranking.totalAppointments += 1;
        ranking.lastPracticeDate = new Date();
        await ranking.save();
      } else {
        await PracticeRanking.create({
          userId: req.user._id,
          totalOvers: parseInt(numberOfOvers),
          totalAppointments: 1,
          lastPracticeDate: new Date(),
        });
      }
    }

    res.status(201).json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status or details
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Allow user to cancel their own pending booking or admin to update anything
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    const { status, notes } = req.body;
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
