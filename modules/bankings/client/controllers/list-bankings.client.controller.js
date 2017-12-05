(function () {
  'use strict';

  angular
    .module('bankings')
    .controller('BankingsListController', BankingsListController);

  BankingsListController.$inject = ['$scope', 'BankingsService', 'TokenService'];

  function BankingsListController($scope, BankingsService, TokenService) {
    var vm = this;

    vm.bankings = BankingsService.query();
    vm.token = TokenService.get();
    $scope.token = vm.token;
  }
}());
