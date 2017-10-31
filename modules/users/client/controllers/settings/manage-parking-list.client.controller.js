(function () {
  'use strict';

  angular
    .module('users')
    .controller('ManageParkingListController', ManageParkingListController);

  ManageParkingListController.$inject = ['$state', '$window', 'ManageParkingService', 'Notification'];

  function ManageParkingListController($state, $window, ManageParkingService, Notification) {
    var vm = this;
    vm.spots = ManageParkingService.query();
    vm.remove = remove;

    function remove(spot) {
      if ($window.confirm('Are you sure you want to delete?')) {
        spot.$remove(function () {
          $state.go('settings.parking', {}, { reload: true });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot deleted successfully!' });
        });
      }
    }
  }
}());
