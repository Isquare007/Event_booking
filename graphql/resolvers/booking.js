const Booking = require("../../models/bookings");
const Event = require("../../models/event");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User Unauthenticated");
    }
    try {
      const bookings = await Booking.find({user: req.userId.userId});
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User Unauthenticated");
    }
    const passedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId.userId,
      event: passedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User Unauthenticated");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const userId = booking.user.toString();
      const event = transformEvent(booking.event);
      // console.log(id);
      if (userId === req.userId.userId) {
        await Booking.deleteOne({ _id: args.bookingId });
      } else {
        throw new Error("Not authorized to perform action");
      }
      return event;
    } catch (err) {
      throw err;
    }
  },
};
