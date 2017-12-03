(function () {
  'use strict';

  angular
    .module('parking.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('booking', {
        abstract: true,
        url: '/bookings',
        templateUrl: '</modules/booking/client/views/booking.client.view.html>'
      })
      .state('booking.user', {
        url: '-user',
        templateUrl: '/modules/booking/client/views/booking-user.client.view.html',
        controller: 'BookingUserController',
        controllerAs: 'vm'
      })
      .state('booking.host', {
        url: '-host',
        templateUrl: '/modules/booking/client/views/booking-host.client.view.html',
        controller: 'BookingHostController',
        controllerAs: 'vm'
      });
  }
}());
