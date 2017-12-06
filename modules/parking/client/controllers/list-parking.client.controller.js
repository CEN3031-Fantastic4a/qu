(function () {
  'use strict';

  angular
    .module('parking')
    .controller('ParkingListController', ParkingListController);

  ParkingListController.$inject = ['ParkingService', 'NgMap'];

  function ParkingListController(ParkingService, NgMap) {
    var vm = this;
    vm.spots = ParkingService.query();
  }
}());
