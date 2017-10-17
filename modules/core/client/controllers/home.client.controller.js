(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController() {
    var vm = this;
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
