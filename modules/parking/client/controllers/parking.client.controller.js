
(function () {
  'use strict';

  angular
    .module('parking')
    .controller('ParkingController', ParkingController);

  ParkingController.$inject = ['$scope', 'parkingResolve', 'Authentication', 'ParkingService', '$location'];

  function ParkingController($scope, spot, Authentication, ParkingService, $location) {
    var vm = this;

    vm.spot = spot;
    vm.authentication = Authentication;

    vm.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'parkingForm');
        return false;
      }
      var spot = new ParkingService({
        address: this.address,
        city_name: this.city_name,
        description: this.description,
        postal_code: this.postal_code,
        number_of_space_spot: this.number_of_space_spot,
        country_id: 1
      });
      spot.$save(function (response) {
        $location.path('parking/' + response._id);
        $scope.address = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
}());
/* 'use strict';
angular.module('parking').controller('ParkingController', ['$scope', '$location', 'Authentication', 'ParkingService',
  function ($scope, $location, Authentication, ParkingService) {
    $scope.authentication = Authentication;
    $scope.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'parkingForm');
        return false;
      }
      var spot = new ParkingService({
        address: this.address,
        city_name: this.city_name,
        description: this.description,
        postal_code: this.postal_code,
        number_of_space_spot: this.number_of_space_spot,
        country_id: 1
      });
      spot.$save(function (response) {
        $location.path('parking/' + response._id);
        $scope.address = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]); */
