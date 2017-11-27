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
    vm.save = save;

    // Save Parking Spot
    function save(isValid) {
      if ($window.confirm('Are you sure you want to save?')) {
        // if (vm.spot.mon_start_time > vm.spot.mon_end_time || isValid) {
        //   console.log('range wrong');
        //   $scope.$broadcast('show-errors-check-validity', 'vm.form.parkingForm');
        //   return false;
        // }
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.form.parkingForm');
          return false;
        }

        // Create a new parking spot, or update the current instance
        vm.spot.createOrUpdate()
          .then(function successCallback(res) {
            console.log(res);
            $state.go('home', {}, { reload: true }); // should we send the User to the list or the updated Parking Spot's view?
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot saved successfully!' });
          }).catch(function errorCallback(res) {
            Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Parking Spot save error!' });
          });
      }
    }

    var fpicker = $(function () {
      // debugger;
      $('#datetimepicker3').datetimepicker({
        collapse: false
      });
      $('#datetimepicker4').datetimepicker({
        collapse: false
      });
    });
  }
}());
