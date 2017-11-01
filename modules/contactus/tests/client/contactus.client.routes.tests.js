(function () {
  'use strict';

  describe('Contactus Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContactusService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContactusService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContactusService = _ContactusService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('contactus');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contactus');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ContactusController,
          mockContactu;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('contactus.view');
          $templateCache.put('modules/contactus/client/views/view-contactu.client.view.html', '');

          // create mock Contactu
          mockContactu = new ContactusService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contactu Name'
          });

          // Initialize Controller
          ContactusController = $controller('ContactusController as vm', {
            $scope: $scope,
            contactuResolve: mockContactu
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:contactuId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.contactuResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            contactuId: 1
          })).toEqual('/contactus/1');
        }));

        it('should attach an Contactu to the controller scope', function () {
          expect($scope.vm.contactu._id).toBe(mockContactu._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/contactus/client/views/view-contactu.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContactusController,
          mockContactu;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('contactus.create');
          $templateCache.put('modules/contactus/client/views/form-contactu.client.view.html', '');

          // create mock Contactu
          mockContactu = new ContactusService();

          // Initialize Controller
          ContactusController = $controller('ContactusController as vm', {
            $scope: $scope,
            contactuResolve: mockContactu
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contactuResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/contactus/create');
        }));

        it('should attach an Contactu to the controller scope', function () {
          expect($scope.vm.contactu._id).toBe(mockContactu._id);
          expect($scope.vm.contactu._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/contactus/client/views/form-contactu.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContactusController,
          mockContactu;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('contactus.edit');
          $templateCache.put('modules/contactus/client/views/form-contactu.client.view.html', '');

          // create mock Contactu
          mockContactu = new ContactusService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contactu Name'
          });

          // Initialize Controller
          ContactusController = $controller('ContactusController as vm', {
            $scope: $scope,
            contactuResolve: mockContactu
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contactuId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contactuResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contactuId: 1
          })).toEqual('/contactus/1/edit');
        }));

        it('should attach an Contactu to the controller scope', function () {
          expect($scope.vm.contactu._id).toBe(mockContactu._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/contactus/client/views/form-contactu.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
