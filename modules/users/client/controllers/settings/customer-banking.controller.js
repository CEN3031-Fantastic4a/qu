(function () {
  'use strict';

  angular
    .module('users')
    .controller('customerBankingSetting', customerBankingSetting);

  customerBankingSetting.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification', 'TokenService'];

  function customerBankingSetting($scope, $http, $location, UsersService, Authentication, Notification, TokenService) {
    var vm = this;
    vm.user = Authentication.user;
    $scope.vis = true;
    $scope.changevis = function () {
      if ($scope.vis) {
        $scope.vis = false;
      } else {
        $scope.vis = true;
      }
    };
    vm.token = TokenService.get(function (data) {
      var x = document.getElementById('drop').getAttribute('value');
      var button = document.querySelector('#submit-button');
      braintree.dropin.create({
        authorization: data.token,
        container: '#dropin-container'
      }, function (createErr, instance) {
        button.addEventListener('click', function () {
          instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {

            // need to implement error and success;
          });
        });
      });
    });
  }
}());
