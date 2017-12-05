(function () {
  'use strict';

  angular
    .module('booking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Booking',
      state: 'booking',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'booking', {
      title: 'My Bookings',
      state: 'booking.renter',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'booking', {
      title: 'Host Bookings',
      state: 'booking.host',
      roles: ['*']
    });
  }
}());
