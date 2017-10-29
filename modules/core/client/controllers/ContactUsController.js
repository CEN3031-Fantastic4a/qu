(function () {
  'use strict';
  angular
  .module('users')
  .controller('ContactUsController', ContactUsController);

  ContactUsController.$inject = ['$scope', 'Authentication'];
  function ContactUsController($scope, Authentication) {
    var vm = this;
    vm.user = Authentication.user;

    $scope.checkboxModel = {
      anonymous: true
    };
  }
}());
