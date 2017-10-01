'use strict';

/**
 * Module dependencies
 */
var spotsPolicy = require('../policies/articles.server.policy'),
  spots = require('../controllers/articles.server.controller');

module.exports = function (app) {
  // Host Parking Spots collection routes
  app.route('/api/articles').all(spotsPolicy.isAllowed)
    .get(spots.list)
    .post(spots.create);

  // Single host parking spot routes
  app.route('/api/articles/:spotId').all(spotsPolicy.isAllowed)
    .get(spots.read)
    .put(spots.update)
    .delete(spots.delete);

  // Finish by binding the host parking spot middleware
  app.param('spotId', spots.spotByID);
};
