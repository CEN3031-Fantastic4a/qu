(function () {
  'use strict';

  angular
    .module('contactus')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contactus', {
        abstract: false,
        url: '/contactus',
        templateUrl: 'modules/contactus/client/views/form-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: newContactu
        },
        data: {
          pageTitle: 'Contact Us'
        }
      });
  }

  getContactu.$inject = ['$stateParams', 'ContactusService'];

  function getContactu($stateParams, ContactusService) {
    return ContactusService.get({
      contactuId: $stateParams.contactuId
    }).$promise;
  }

  newContactu.$inject = ['ContactusService'];

  function newContactu(ContactusService) {
    return new ContactusService();
  }
}());
