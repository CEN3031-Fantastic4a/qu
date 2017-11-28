'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Banking = mongoose.model('Banking'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Banking
 */
exports.create = function(req, res) {
  var banking = new Banking(req.body);
  banking.user = req.user;

  banking.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(banking);
    }
  });
};

/**
 * Show the current Banking
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var banking = req.banking ? req.banking.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  banking.isCurrentUserOwner = req.user && banking.user && banking.user._id.toString() === req.user._id.toString();

  res.jsonp(banking);
};

/**
 * Update a Banking
 */
exports.update = function(req, res) {
  var banking = req.banking;

  banking = _.extend(banking, req.body);

  banking.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(banking);
    }
  });
};

/**
 * Delete an Banking
 */
exports.delete = function(req, res) {
  var banking = req.banking;

  banking.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(banking);
    }
  });
};

/**
 * List of Bankings
 */
exports.list = function(req, res) {
  Banking.find().sort('-created').populate('user', 'displayName').exec(function(err, bankings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bankings);
    }
  });
};

/**
 * Banking middleware
 */
exports.bankingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Banking is invalid'
    });
  }

  Banking.findById(id).populate('user', 'displayName').exec(function (err, banking) {
    if (err) {
      return next(err);
    } else if (!banking) {
      return res.status(404).send({
        message: 'No Banking with that identifier has been found'
      });
    }
    req.banking = banking;
    next();
  });
};
