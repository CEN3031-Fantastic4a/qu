(function () {
  'use strict';

  // Bankings controller
  angular
    .module('bankings')
    .controller('BankingsController', BankingsController);

  BankingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'bankingResolve'];

  function BankingsController ($scope, $state, $window, Authentication, banking) {
    var vm = this;

    vm.authentication = Authentication;
    vm.banking = banking;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Banking
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.banking.$remove($state.go('bankings.list'));
      }
    }

    // Save Banking
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bankingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.banking._id) {
        vm.banking.$update(successCallback, errorCallback);
      } else {
        vm.banking.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('bankings.view', {
          bankingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
