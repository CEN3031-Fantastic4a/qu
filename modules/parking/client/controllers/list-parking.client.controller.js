(function () {
  'use strict';

  angular
    .module('parking')
    .controller('ParkingListController', ParkingListController);

  ParkingListController.$inject = ['ParkingService'];

  function ParkingListController(ParkingService) {
    var vm = this;

    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAJEoMA7rbgnOKG2ILkLNSaj8XB9zaR3Bo';
    vm.spots = ParkingService.query();
  }
}());
