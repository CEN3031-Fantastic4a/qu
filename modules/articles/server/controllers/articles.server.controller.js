'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Spot = mongoose.model('Spot'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Host Parking Spot
 */
exports.create = function (req, res) {
  var spot = new Spot(req.body);
  spot.user = req.user;

  spot.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(spot);
    }
  });
};

/**
 * Show the current parking spot
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var spot = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Spot, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Host Spot model.
  spot.isCurrentUserOwner = !!(req.user && spot.user && spot.user._id.toString() === req.user._id.toString());

  res.json(spot);
};

/**
 * Update a spot
 */
exports.update = function (req, res) {
  var spot = req.article;

  spot.update_date = Date.now;

  spot.address = req.body.address;
  spot.postal_code = req.body.postal_code;
  spot.country_id = req.body.country_id;
  spot.state_id = req.body.state_id;
  spot.city_name = req.body.city_name;
  spot.verification_status = req.body.verification_status;
  spot.users_verification_status = req.body.users_verification_status;
  spot.status = req.body.status;
  spot.number_of_space_spot = req.body.number_of_space_spot;
  spot.description = req.body.description;
  spot.location = req.body.location;
  spot.latitude = req.body.latitude;
  spot.instant_rent = req.body.instant_rent;
  spot.renting_type = req.body.renting_type;
  spot.sche_start_date = req.body.sche_start_date;
  spot.sche_start_time = req.body.sche_start_time;
  spot.no_of_hours = req.body.no_of_hours;
  spot.no_of_days = req.body.no_of_days;
  spot.no_of_months = req.body.no_of_months;
  spot.mon = req.body.mon;
  spot.tue = req.body.tue;
  spot.wed = req.body.wed;
  spot.thur = req.body.thur;
  spot.fri = req.body.fri;
  spot.sat = req.body.sat;
  spot.sun = req.body.sun;
  spot.verification_code = req.body.verification_code;

  spot.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(spot);
    }
  });
};

/**
 * Delete a spot
 */
exports.delete = function (req, res) {
  var spot = req.article;

  spot.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(spot);
    }
  });
};

/**
 * List of Host Parking Spots
 */
exports.list = function (req, res) {
  Spot.find().sort('-created').populate('user', 'displayName').exec(function (err, spots) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(spots);
    }
  });
};

/**
 * Host Parking Spot middleware
 */
exports.spotByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Parking Spot is invalid'
    });
  }

  Spot.findById(id).populate('user', 'displayName').exec(function (err, spot) {
    if (err) {
      return next(err);
    } else if (!spot) {
      return res.status(404).send({
        message: 'No spot with that identifier has been found'
      });
    }
    req.article = spot;
    next();
  });
};
