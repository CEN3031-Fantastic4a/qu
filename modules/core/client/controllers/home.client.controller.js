(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController() {
    var vm = this;

    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAJEoMA7rbgnOKG2ILkLNSaj8XB9zaR3Bo';

    var g = $(function () {
      $('#datetimepicker1').datetimepicker({
        collapse: false
      });
      $('#datetimepicker2').datetimepicker({
        collapse: false
      });
    });
  }
}());
