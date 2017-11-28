// Bankings service used to communicate Bankings REST endpoints
(function () {
  'use strict';

  angular
    .module('bankings')
    .factory('BankingsService', BankingsService);

  BankingsService.$inject = ['$resource'];

  function BankingsService($resource) {
    return $resource('api/bankings/:bankingId', {
      bankingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
