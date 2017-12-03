(function () {
  'use strict';

  angular
    .module('booking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Bookings',
      state: 'booking',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'booking', {
      title: 'My Bookings',
      state: 'booking.user',
      roles: ['user', 'admin']
    });
    menuService.addSubMenuItem('topbar', 'booking', {
      title: 'Host Bookings',
      state: 'booking.host',
      roles: ['user', 'admin']
    });
  }
}());
