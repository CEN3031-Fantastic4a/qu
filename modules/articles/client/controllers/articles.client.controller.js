'use strict';
angular.module('articles').controller('ArticlesController', ['$scope', '$location', 'Authentication', 'ArticlesService',
  function ($scope, $location, Authentication, ArticlesService) {
    $scope.authentication = Authentication;
    $scope.create = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');
        return false;
      }
      var spot = new ArticlesService({
        address: this.address,
        city_name: this.city_name,
        description: this.description,
        postal_code: this.postal_code,
        number_of_space_spot: this.number_of_space_spot,
        country_id: 1
      });
      spot.$save(function (response) {
        $location.path('articles/' + response._id);
        $scope.address = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
