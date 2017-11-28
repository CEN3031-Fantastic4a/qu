// Contactus service used to communicate Contactus REST endpoints
(function () {
  'use strict';

  angular
    .module('contactus')
    .factory('ContactusService', ContactusService);

  ContactusService.$inject = ['$resource'];

  function ContactusService($resource) {
    return $resource('api/contactus/:contactuId', {
      contactuId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
