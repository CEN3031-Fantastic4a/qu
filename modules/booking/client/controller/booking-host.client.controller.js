(function () {
    'use strict';
  
    angular
      .module('booking')
      .controller('BookingHostController', BookingHostController);
  
    BookingHostController.$inject = [''];
  
    function BookingHostController() {
      var vm = this;
  
      vm.spots = ParkingService.query();
    }
  }());