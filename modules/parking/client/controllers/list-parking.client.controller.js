(function () {
  'use strict';

  angular
    .module('parking')
    .controller('ParkingListController', ParkingListController);

  ParkingListController.$inject = ['ParkingService', 'NgMap'];

  function ParkingListController(ParkingService, NgMap) {
    var vm = this;
    vm.spots = ParkingService.query();

    vm.showSpotInfo = function (event, spot) {
      vm.selectedCity = spot;
      vm.map.setZoom(18);
      // vm.map.setCenter(new google.maps.LatLng(vm.selectedCity.latitude, vm.selectedCity.longitude));
      vm.map.showInfoWindow('myInfoWindow', this);
    };

    NgMap.getMap().then(function (map) {
		  vm.map = map;
      vm.showCustomMarker = function(evt){
			  console.log('showing marker');
		  };
		  vm.closeCustomMarker = function (evt) {
        this.style.display = 'none';
      };
	  });
  }
}());
