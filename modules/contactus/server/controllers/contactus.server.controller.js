'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contactu = mongoose.model('Contactu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Contactu
 */
exports.create = function (req, res) {
  var contactu = new Contactu(req.body);

  contactu.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contactu);
    }
  });
};

/**
 * Show the current Contactu
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var contactu = req.contactu ? req.contactu.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  contactu.isCurrentUserOwner = req.user && contactu.user && contactu.user._id.toString() === req.user._id.toString();

  res.jsonp(contactu);
};

/**
 * Update a Contactu
 */
exports.update = function (req, res) {
  var contactu = req.contactu;

  contactu = _.extend(contactu, req.body);

  contactu.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contactu);
    }
  });
};

/**
 * Delete an Contactu
 */
exports.delete = function (req, res) {
  var contactu = req.contactu;

  contactu.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contactu);
    }
  });
};

/**
 * List of Contactus
 */
exports.list = function (req, res) {
  Contactu.find().sort('-created').populate('user', 'displayName').exec(function (err, contactus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contactus);
    }
  });
};

/**
 * Contactu middleware
 */
exports.contactuByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contactu is invalid'
    });
  }

  Contactu.findById(id).populate('user', 'displayName').exec(function (err, contactu) {
    if (err) {
      return next(err);
    } else if (!contactu) {
      return res.status(404).send({
        message: 'No Contactu with that identifier has been found'
      });
    }
    req.contactu = contactu;
    next();
  });
};
