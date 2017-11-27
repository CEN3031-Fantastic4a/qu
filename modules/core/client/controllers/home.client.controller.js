(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController() {
    var vm = this;
    vm.lat = 29.65;
    vm.lng = -82.32;
    vm.changeCenter = changeCenter;

    var g = $(function () {
      $('#datetimepicker1').datetimepicker({
        collapse: false
      });
      $('#datetimepicker2').datetimepicker({
        collapse: false
      });
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 14
        });

        var current = new google.maps.InfoWindow;
        current.setPosition(pos);
        current.setContent('Current Location');
        current.open(map);
        map.setCenter(pos);
      });
    } else {
      alert('Browser doesn\'t support Geolocation.');
    }

    function changeCenter() {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': vm.newAddress
      }, function (results, status) {
        console.log(status);
        console.log(vm.newAddress);
        console.log(results);
        if (results.length > 0) {
          console.log(results[0].geometry.location.lat());
          vm.lat = results[0].geometry.location.lat();
          vm.lng = results[0].geometry.location.lng();
          var cur = { lat: vm.lat, lng: vm.lng };
          var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: vm.lat, lng: vm.lng },
            zoom: 14
          });
          var infoWindow = new google.maps.InfoWindow;
          infoWindow.setPosition(cur);
          infoWindow.setContent('Park here');
          infoWindow.open(map);
        } else {
          alert('Cannot find ' + vm.newAddress);
        }
      });
    }
  }
}());
