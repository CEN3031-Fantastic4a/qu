(function () {
  'use strict';

  angular
    .module('users')
    .controller('ManageParkingDetailsController', ManageParkingDetailsController);

  ManageParkingDetailsController.$inject = ['$state', 'parkingResolve', '$window', 'ManageParkingService', 'Notification'];

  function ManageParkingDetailsController($state, spot, $window, ManageParkingService, Notification) {
    var vm = this;
    vm.spot = spot;
    vm.remove = remove;
    // vm.findOne = findOne;
    // let id = $stateParams.spotId;
    // console.log(id);

    // console.log('target info: ');
    // console.log(target);
    // console.log(test);
    // console.log(test.address);

    // spots.findById(id, function(err, user) {
    //   if (err) throw err;
    //
    //   // show the one user
    //   console.log(spot);
    // });
    //


    // console.log(target.address);

    function remove(spot) {
      if ($window.confirm('Are you sure you want to delete?')) {
        spot.$remove(function () {
          $state.go('settings.parking', {}, { reload: true });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Parking Spot deleted successfully!' });
        });
      }
    }
  }
}());
