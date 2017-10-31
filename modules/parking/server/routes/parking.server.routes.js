'use strict';

/**
 * Module dependencies
 */
var parkingPolicy = require('../policies/parking.server.policy'),
  spots = require('../controllers/parking.server.controller'),
  getCoordinates = require('../controllers/coordinates.server.controller');

module.exports = function (app) {
  // Host Parking Spots collection routes
  app.route('/api/parking').all(parkingPolicy.isAllowed)
    .get(spots.list)
    .post(getCoordinates, spots.create);

  // Single host parking spot routes
  app.route('/api/parking/:spotId').all(parkingPolicy.isAllowed)
    .get(spots.read)
    .put(getCoordinates, spots.update)
    .delete(spots.delete);

  // Finish by binding the host parking spot middleware
  app.param('spotId', spots.spotByID);
};
