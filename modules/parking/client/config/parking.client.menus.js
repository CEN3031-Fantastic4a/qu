(function () {
  'use strict';

  angular
    .module('parking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Parking',
      state: 'parking',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'parking', {
      title: 'List Parking',
      state: 'parking.list',
      roles: ['*']
    });
  }
}());
