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
  angular
    .module('bankings')
    .factory('TokenService', TokenService);

  TokenService.$inject = ['$resource'];

  function TokenService($resource) {
    return $resource('/api/bankings-clienttoken', {}, {
      get: {
        method: 'GET'
      }
    }
    );
  }
}());
