(function () {
  'use strict';

  describe('Parking Route Tests', function () {
    // Initialize global variables
    var $scope,
      ParkingService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ParkingService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ParkingService = _ParkingService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('parking');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/parking');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('parking.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/parking/client/views/list-parking.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ParkingController,
          mockParking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('parking.view');
          $templateCache.put('/modules/parking/client/views/view-parking.client.view.html', '');

          // create mock parking spot
          mockParking = new ParkingService({
            _id: '525a8422f6d0f87f0e407a33',
            address: '444 Newell Drive',
            postal_code: '32611',
            city_name: 'Gainesville',
            description: 'MEAN rocks!'
          });

          // Initialize Controller
          ParkingController = $controller('ParkingController as vm', {
            $scope: $scope,
            parkingResolve: mockParking
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:spotId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.parkingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            spotId: 1
          })).toEqual('/parking/1');
        }));

        it('should attach a parking spot to the controller scope', function () {
          expect($scope.vm.spot._id).toBe(mockParking._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/parking/client/views/view-parking.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/parking/client/views/list-parking.client.view.html', '');

          $state.go('parking.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('parking/');
          $rootScope.$digest();

          expect($location.path()).toBe('/parking');
          expect($state.current.templateUrl).toBe('/modules/parking/client/views/list-parking.client.view.html');
        }));
      });
    });
  });
}());
