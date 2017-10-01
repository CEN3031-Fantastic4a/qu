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

  spot.address.streetAddress = req.body.address.streetAddress;
  spot.address.city = req.body.address.city;
  spot.address.state = req.body.address.state;
  spot.address.zip = req.body.address.zip;
  spot.address.country = req.body.address.country;

  spot.availability = req.body.availability;
  spot.description = req.body.description;
  spot.price = req.body.price;
  spot.active = req.body.active;

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
