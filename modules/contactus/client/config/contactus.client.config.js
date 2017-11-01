(function () {
  'use strict';

  angular
    .module('contactus')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Contact Us',
      state: 'contactus',
      roles: ['*']
    });
  }
}());
