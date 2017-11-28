(function () {
  'use strict';

  angular
    .module('bankings')
    .controller('BankingsListController', BankingsListController);

  BankingsListController.$inject = ['BankingsService'];

  function BankingsListController(BankingsService) {
    var vm = this;

    vm.bankings = BankingsService.query();
  }
}());
