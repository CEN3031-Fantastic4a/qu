(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('ManageParkingService', ManageParkingService);

  ManageParkingService.$inject = ['$resource', '$log'];

  function ManageParkingService($resource, $log) {
    var Spot = $resource('/api/manage-parking/:spotId', {
      spotId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Spot.prototype, {
      createOrUpdate: function () {
        var spot = this;
        return createOrUpdate(spot);
      }
    });

    return Spot;

    function createOrUpdate(spot) {
      if (spot._id) {
        return spot.$update(onSuccess, onError);
      } else {
        return spot.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(spot) {
      // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
