(function () {
  'use strict';

  angular
    .module('users')
    .controller('customerBankingSetting', customerBankingSetting);

  customerBankingSetting.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];

  function customerBankingSetting($scope, $http, $location, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;

  }
}());
