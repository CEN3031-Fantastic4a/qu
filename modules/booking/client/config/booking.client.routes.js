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
          url: '/booking',
          templateUrl: '</modules/booking/client/views/booking.client.view.html>'
        })

        .state('booking.hoster', {
            url: '',
            templateUrl: '/modules/booking/client/views/booking-host.client.view.html',
            controller: 'BookingHostController',
            controllerAs: 'vm'
          })
          .state('booking.renter', {
            url: '',
            templateUrl: '/modules/booking/client/views/booking-user.client.view.html',
            controller: 'ParkingListController',
            controllerAs: 'vm'
          })
    }
  
    getParking.$inject = ['$stateParams', 'ParkingService'];
  
    function getParking($stateParams, ParkingService) {
      return ParkingService.get({
        spotId: $stateParams.spotId
      }).$promise;
    }
  //idk if I know this 
    newParking.$inject = ['ManageParkingService'];
  
    function newParking(ManageParkingService) {
      return new ManageParkingService();
    }
  }());
  