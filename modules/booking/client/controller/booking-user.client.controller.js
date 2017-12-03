(function () {
  'use strict';

  angular
    .module('users')
    .controller('BookingUserController', BookingUserController);

  BookingUserController.$inject = ['$state', 'BookingUserService'];

  function BookingUserController($state, BookingUserService) {
    var vm = this;
    vm.bookings = BookingUserService.query();
  }
}());
