(function () {
  'use strict';

  describe('Parking Spot Route Tests', function () {
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
          mainstate = $state.get('admin.parking');
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
          liststate = $state.get('admin.parking.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/parking/client/views/admin/list-parking.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ParkingAdminController,
          mockParking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.parking.create');
          $templateCache.put('/modules/parking/client/views/admin/form-parking.client.view.html', '');

          // Create mock parking spot
          mockParking = new ParkingService();

          // Initialize Controller
          ParkingAdminController = $controller('ParkingAdminController as vm', {
            $scope: $scope,
            parkingResolve: mockParking
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.parkingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/parking/create');
        }));

        it('should attach an parking to the controller scope', function () {
          expect($scope.vm.spot._id).toBe(mockParking._id);
          expect($scope.vm.spot._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/parking/client/views/admin/form-parking.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ParkingAdminController,
          mockParking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.parking.edit');
          $templateCache.put('/modules/parking/client/views/admin/form-parking.client.view.html', '');

          // Create mock parking
          mockParking = new ParkingService({
            _id: '525a8422f6d0f87f0e407a33',
            address: '444 Newell Drive',
            postal_code: '32611',
            city_name: 'Gainesville',
            description: 'MEAN rocks!'
          });

          // Initialize Controller
          ParkingAdminController = $controller('ParkingAdminController as vm', {
            $scope: $scope,
            parkingResolve: mockParking
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:spotId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.parkingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            spotId: 1
          })).toEqual('/admin/parking/1/edit');
        }));

        it('should attach a parking spot to the controller scope', function () {
          expect($scope.vm.spot._id).toBe(mockParking._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/parking/client/views/admin/form-parking.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
