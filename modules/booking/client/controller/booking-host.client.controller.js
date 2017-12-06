(function () {
  'use strict';

  angular
    .module('users')
    .controller('BookingHostController', BookingHostController);

  BookingHostController.$inject = ['$state', 'BookingHostService'];

  function BookingHostController($state, BookingHostService) {
    var vm = this;
    vm.bookings = BookingHostService.query();
  }
}());
