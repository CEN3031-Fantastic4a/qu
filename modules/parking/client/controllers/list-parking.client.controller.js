(function () {
  'use strict';

  angular
    .module('parking')
    .controller('ParkingListController', ParkingListController);

  ParkingListController.$inject = ['ParkingService'];

  function ParkingListController(ParkingService) {
    var vm = this;

    vm.spots = ParkingService.query();
  }
}());
