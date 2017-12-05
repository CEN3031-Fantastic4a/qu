(function () {
  'use strict';

  angular
    .module('booking')
    .controller('BookingHostController', BookingHostController);

  BookingHostController.$inject = ['ParkingService'];

  function BookingHostController(ParkingService) {
    var vm = this;

    vm.spots = ParkingService.query();
  }
}());
