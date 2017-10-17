(function () {
  'use strict';

  angular
    .module('parking.admin')
    .controller('ParkingAdminController', ParkingAdminController);

  ParkingAdminController.$inject = ['$scope', '$state', '$window', 'parkingResolve', 'Authentication', 'Notification'];

  function ParkingAdminController($scope, $state, $window, spot, Authentication, Notification) {
    var vm = this;

    vm.spot = spot;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Parking Spot
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.spot.$remove(function () {
          $state.go('admin.parking.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot deleted successfully!' });
        });
      }
    }

    // Save Parking Spot
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.parkingForm');
        return false;
      }

      // Create a new parking spot, or update the current instance
      vm.spot.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.parking.list'); // should we send the User to the list or the updated Parking Spot's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Parking Spot save error!' });
      }
    }
  }
}());
