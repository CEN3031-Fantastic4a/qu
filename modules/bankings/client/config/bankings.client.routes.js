(function () {
  'use strict';

  angular
    .module('bankings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bankings', {
        abstract: true,
        url: '/bankings',
        template: '<ui-view/>'
      })
      .state('bankings.list', {
        url: '',
        templateUrl: 'modules/bankings/client/views/list-bankings.client.view.html',
        controller: 'BankingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bankings List'
        }
      })
      .state('bankings.create', {
        url: '/create',
        templateUrl: 'modules/bankings/client/views/form-banking.client.view.html',
        controller: 'BankingsController',
        controllerAs: 'vm',
        resolve: {
          bankingResolve: newBanking
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bankings Create'
        }
      })
      .state('bankings.edit', {
        url: '/:bankingId/edit',
        templateUrl: 'modules/bankings/client/views/form-banking.client.view.html',
        controller: 'BankingsController',
        controllerAs: 'vm',
        resolve: {
          bankingResolve: getBanking
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Banking {{ bankingResolve.name }}'
        }
      })
      .state('bankings.view', {
        url: '/:bankingId',
        templateUrl: 'modules/bankings/client/views/view-banking.client.view.html',
        controller: 'BankingsController',
        controllerAs: 'vm',
        resolve: {
          bankingResolve: getBanking
        },
        data: {
          pageTitle: 'Banking {{ bankingResolve.name }}'
        }
      });
  }

  getBanking.$inject = ['$stateParams', 'BankingsService'];

  function getBanking($stateParams, BankingsService) {
    return BankingsService.get({
      bankingId: $stateParams.bankingId
    }).$promise;
  }

  newBanking.$inject = ['BankingsService'];

  function newBanking(BankingsService) {
    return new BankingsService();
  }
}());
