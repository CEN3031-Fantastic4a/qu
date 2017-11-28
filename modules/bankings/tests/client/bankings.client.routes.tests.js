(function () {
  'use strict';

  describe('Bankings Route Tests', function () {
    // Initialize global variables
    var $scope,
      BankingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BankingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BankingsService = _BankingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('bankings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/bankings');
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
          BankingsController,
          mockBanking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('bankings.view');
          $templateCache.put('modules/bankings/client/views/view-banking.client.view.html', '');

          // create mock Banking
          mockBanking = new BankingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Banking Name'
          });

          // Initialize Controller
          BankingsController = $controller('BankingsController as vm', {
            $scope: $scope,
            bankingResolve: mockBanking
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:bankingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.bankingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            bankingId: 1
          })).toEqual('/bankings/1');
        }));

        it('should attach an Banking to the controller scope', function () {
          expect($scope.vm.banking._id).toBe(mockBanking._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/bankings/client/views/view-banking.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BankingsController,
          mockBanking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('bankings.create');
          $templateCache.put('modules/bankings/client/views/form-banking.client.view.html', '');

          // create mock Banking
          mockBanking = new BankingsService();

          // Initialize Controller
          BankingsController = $controller('BankingsController as vm', {
            $scope: $scope,
            bankingResolve: mockBanking
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.bankingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/bankings/create');
        }));

        it('should attach an Banking to the controller scope', function () {
          expect($scope.vm.banking._id).toBe(mockBanking._id);
          expect($scope.vm.banking._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/bankings/client/views/form-banking.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BankingsController,
          mockBanking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('bankings.edit');
          $templateCache.put('modules/bankings/client/views/form-banking.client.view.html', '');

          // create mock Banking
          mockBanking = new BankingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Banking Name'
          });

          // Initialize Controller
          BankingsController = $controller('BankingsController as vm', {
            $scope: $scope,
            bankingResolve: mockBanking
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:bankingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.bankingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            bankingId: 1
          })).toEqual('/bankings/1/edit');
        }));

        it('should attach an Banking to the controller scope', function () {
          expect($scope.vm.banking._id).toBe(mockBanking._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/bankings/client/views/form-banking.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
