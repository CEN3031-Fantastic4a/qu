(function () {
  'use strict';

  angular
    .module('parking.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.parking', {
        abstract: true,
        url: '/parking',
        template: '<ui-view/>'
      })
      .state('admin.parking.list', {
        url: '',
        templateUrl: '/modules/parking/client/views/admin/list-parking.client.view.html',
        controller: 'ParkingAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.parking.create', {
        url: '/create',
        templateUrl: '/modules/parking/client/views/admin/form-parking.client.view.html',
        controller: 'ParkingAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          parkingResolve: newParking
        }
      })
      .state('admin.parking.edit', {
        url: '/:spotId/edit',
        templateUrl: '/modules/parking/client/views/admin/form-parking.client.view.html',
        controller: 'ParkingAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ parkingResolve.title }}'
        },
        resolve: {
          parkingResolve: getParking
        }
      });
  }

  getParking.$inject = ['$stateParams', 'ParkingService'];

  function getParking($stateParams, ParkingService) {
    return ParkingService.get({
      spotId: $stateParams.spotId
    }).$promise;
  }

  newParking.$inject = ['ParkingService'];

  function newParking(ParkingService) {
    return new ParkingService();
  }
}());
