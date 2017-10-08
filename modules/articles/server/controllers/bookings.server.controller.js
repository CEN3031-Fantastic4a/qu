'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Booking = mongoose.model('Booking'),
  Spot = mongoose.model('Spot'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Booking
 */
exports.create = function (req, res) {
  var booking = req.booking;
  booking.user = req.user;

  Spot.findOne({ _id: req.body.booking.spot }, function (err, spot) {
    if (err) {
      return res.json(err);
    }

    Booking.find({ parking_spot_id: booking.spot }).stream().on('data', function (doc) {
      if (!(booking.exit_date_time < doc.entry_date_time) && !(doc.exit_date_time < booking.entry_date_time)) {
        throw err;
      }
    }).on('error', function (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }).then(function () {
      var booking = new Booking();
      booking.user = req.user;
      booking.save(function (err) {
        if (err) throw err;
        return res.json(booking);
      });
    });

    return res.json(err);
  });
};

/**
 * Show the current booking
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var booking = req.booking ? req.booking.toJSON() : {};

  // Add a custom field to the Booking, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Host Spot model.
  booking.isCurrentUserOwner = !!(req.user && booking.user && booking.user._id.toString() === req.user._id.toString());

  res.json(booking);
};

/**
 * Update a booking
 */
exports.update = function (req, res) {
  var booking = req.booking;
  booking.updated_date = Date.now;

  booking.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(booking);
    }
  });
};

/**
 * Delete a booking
 */
exports.delete = function (req, res) {
  Booking.findOne({ _id: req.params.id, user: req.user._id }).exec(function (err, booking) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    if (booking) {
      Spot.findOne({ _id: booking.spot }, function (err, spot) {
        if (err) return res.json(err);

        booking.remove(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(booking);
          }
        });
      });
    } else {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

/**
 * List of all the Bookings done by a User
 */
exports.list = function (req, res) {
  Booking.find({ user: req.user.id }, function (err, bookings) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bookings);
    }
  });
};

/**
 * Booking middleware
 */
exports.bookingByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Booking is invalid'
    });
  }

  Booking.findById(id).populate('user', 'displayName').exec(function (err, booking) {
    if (err) return next(err);
    else if (!booking) {
      return res.status(404).send({
        message: 'No booking with that identifier has been found'
      });
    }
    req.booking = booking;
    next();
  });
};
