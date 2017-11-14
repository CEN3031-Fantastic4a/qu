'use strict';

/**
 * Module dependencies
 */
var contactusPolicy = require('../policies/contactus.server.policy'),
  contactus = require('../controllers/contactus.server.controller');

module.exports = function (app) {
  // Contactus Routes
  app.route('/api/contactus').all(contactusPolicy.isAllowed)
    .post(contactus.create);

  // Finish by binding the Contactu middleware
  app.param('contactuId', contactus.contactuByID);
};
