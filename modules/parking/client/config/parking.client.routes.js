(function () {
  'use strict';

  angular
    .module('parking.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('parking', {
        abstract: true,
        url: '/parking',
        template: '<ui-view/>'
      })
      .state('parking.list', {
        url: '',
        templateUrl: '/modules/parking/client/views/list-parking.client.view.html',
        controller: 'ParkingListController',
        controllerAs: 'vm'
      })
      .state('parking.create', {
        url: 'parking/create',
        templateUrl: '/modules/parking/client/views/create-parking.client.view.html',
        controller: 'ParkingController',
        controllerAs: 'vm'
      })
      .state('parking.view', {
        url: '/:spotId',
        templateUrl: '/modules/parking/client/views/view-parking.client.view.html',
        controller: 'ParkingController',
        controllerAs: 'vm',
        resolve: {
          parkingResolve: getParking
        },
        data: {
          pageTitle: '{{ parkingResolve.address }}'
        }
      });
  }

  getParking.$inject = ['$stateParams', 'ParkingService'];

  function getParking($stateParams, ParkingService) {
    return ParkingService.get({
      spotId: $stateParams.spotId
    }).$promise;
  }
}());
