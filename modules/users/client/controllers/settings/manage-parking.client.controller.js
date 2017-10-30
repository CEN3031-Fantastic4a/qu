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
          .then(function successCallback(res) {
            console.log(res);
            $state.go('settings.parking', {}, { reload: true }); // should we send the User to the list or the updated Parking Spot's view?
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

(function () {
  var dateTimeController = function ($scope, $rootScope) {
    $scope.vm = {
      message: 'Bootstrap DateTimePicker Directive',
      dateTime: {}
    };
    $scope.$watch('change', function () {
      console.log($scope.vm.dateTime);
    });
    $scope.$on('emit:dateTimePicker', function (e, value) {
      $scope.vm.dateTime = value.dateTime;
      console.log(value);
    });
  };
  var dateTimePicker = function ($rootScope) {
    return {
      require: '?ngModel',
      restrict: 'AE',
      scope: {
        pick12HourFormat: '@',
        language: '@',
        useCurrent: '@',
        location: '@'
      },
      link: function (scope, elem, attrs) {
        elem.datetimepicker({
          pick12HourFormat: scope.pick12HourFormat,
          language: scope.language,
          useCurrent: scope.useCurrent
        });
            // Local event change
        elem.on('blur', function () {
          console.info('this', this);
          console.info('scope', scope);
          console.info('attrs', attrs);
              /* // returns moments.js format object
              scope.dateTime = new Date(elem.data("DateTimePicker").getDate().format());
              // Global change propagation
              $rootScope.$broadcast("emit:dateTimePicker", {
                  location: scope.location,
                  action: 'changed',
                  dateTime: scope.dateTime,
                  example: scope.useCurrent
              });
              scope.$apply();*/
        });
      }
    };
  };
  angular.module('dateTimeSandbox', []).run(['$rootScope', function ($rootScope) {
  }]).controller('dateTimeController', ['$scope', '$http', dateTimeController
  ]).directive('dateTimePicker', dateTimePicker);
}());
