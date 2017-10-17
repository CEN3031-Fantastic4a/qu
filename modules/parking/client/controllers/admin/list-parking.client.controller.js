(function () {
  'use strict';

  angular
    .module('parking.admin')
    .controller('ParkingAdminListController', ParkingAdminListController);

  ParkingAdminListController.$inject = ['ParkingService'];

  function ParkingAdminListController(ParkingService) {
    var vm = this;

    vm.spots = ParkingService.query();
  }
}());
