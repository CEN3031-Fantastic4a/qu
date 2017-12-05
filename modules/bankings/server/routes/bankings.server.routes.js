'use strict';

/**
 * Module dependencies
 */
var bankingsPolicy = require('../policies/bankings.server.policy'),
  bankings = require('../controllers/bankings.server.controller');

module.exports = function (app) {
  // Bankings Routes

  app.route('/api/bankings').all(bankingsPolicy.isAllowed)
    .get(bankings.list)
    .post(bankings.create);

  app.route('/api/bankings/:bankingId').all(bankingsPolicy.isAllowed)
    .get(bankings.read)
    .put(bankings.update)
    .delete(bankings.delete);

  app.route('/api/bankings-clienttoken').all(bankingsPolicy.isAllowed)
    .get(bankings.clienttoken);
  // Finish by binding the Banking middleware
  app.param('bankingId', bankings.bankingByID);
};
