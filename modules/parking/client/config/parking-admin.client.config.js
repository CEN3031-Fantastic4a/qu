(function () {
  'use strict';

  // Configuring the Parking Spots Admin module
  angular
    .module('parking.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage ',
      state: 'admin.parking.list'
    });
  }
}());
