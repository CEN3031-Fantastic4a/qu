'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Banking = mongoose.model('Banking'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  braintree = require('braintree'),
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: '6qf28qrc9vr3vm2x',
    publicKey: '4dprt6qmtxqkwt3n',
    privateKey: '266b97b2f1eb726230c4db1d6a39fe0c'
  });

/**
 * Create a Banking
 */
exports.clienttoken = function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.jsonp({ token: response.clientToken });
  });
};

exports.create = function (req, res) {
  var banking = new Banking(req.body);
  banking.user = req.user;
  gateway.customer.create({
    firstName: banking.user.firstName,
    lastName: banking.user.lastName,
    email: banking.user.email
  }, function (err, result) {
    if (!err) {
      banking.accountid = result.customer.id;

      banking.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(banking);
        }
      });
    } else {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

/**
 * Show the current Banking
 */
exports.read = function (req, res) {
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
exports.update = function (req, res) {
  var banking = req.banking;

  banking = _.extend(banking, req.body);

  banking.save(function (err) {
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
exports.delete = function (req, res) {
  var banking = req.banking;
  gateway.customer.delete(banking.accountid, function (err) {
    banking.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(banking);
      }
    });
  });
};

/**
 * List of Bankings
 */
exports.list = function (req, res) {
  Banking.find().sort('-created').populate('user', 'displayName').exec(function (err, bankings) {
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
exports.bankingByID = function (req, res, next, id) {

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
