(function () {
  'use strict';

  angular
    .module('users')
    .controller('ManageParkingController', ManageParkingController);

  ManageParkingController.$inject = ['$scope', '$state', '$window', 'parkingResolve', 'Authentication', 'Notification'];

  function ManageParkingController($scope, $state, $window, spot, Authentication, Notification) {
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
          $state.go('settings.parking', {}, { reload: true });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot deleted successfully!' });
        });
      }
    }

    // Save Parking Spot
    function save(isValid) {
      if ($window.confirm('Are you sure you want to save?')) {
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'vm.form.parkingForm');
            return false;
        }

        // Create a new parking spot, or update the current instance
        vm.spot.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);

        function successCallback(res) {
            console.log(res);
            $state.go('settings.parking', {}, { reload: true }); // should we send the User to the list or the updated Parking Spot's view?
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot saved successfully!' });
        }

        function errorCallback(res) {
            Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Parking Spot save error!' });
        }
      }
    }
  }
}());
