'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  request = require('request');

module.exports = function (req, res, next) {
  if (req.body.address && req.body.city_name && req.body.postal_code) {
    var options = {
      key: 'AIzaSyDbbk7AHIwTz8o9nGHrRXIlcVnl7_YHETU',
      address: req.body.address + ', ' + req.body.city_name + ', ' + req.body.postal_code
    };
    request({
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      qs: options
    }, function (err, response, body) {
      if (err) {
        res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      var data = JSON.parse(body);
      // debugger;
      // console.log(data.results[0]);
      req.results = data.results[0].geometry.location;
      next();
    });
  } else {
    next();
  }
};
