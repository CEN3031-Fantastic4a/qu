(function () {
  'use strict';

  describe('Edit Profile Controller Tests', function () {
    // Initialize global variables
    var ContactusController,
      $scope,
      $httpBackend,
      Authentication,
      ContactusService,
      Notification;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _Authentication_, _ContactusService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      Authentication = _Authentication_;
      ContactusService = _ContactusService_;
      Notification = _Notification_;


      // Spy on Notification
      spyOn($scope, '$broadcast');
      spyOn(Notification, 'success');

      // Ignore parent template gets on state transition
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200);
      $httpBackend.whenGET('/modules/core/client/views/400.client.view.html').respond(200);

      // Mock logged in user
      Authentication.user = {
        _id: '525a8422f6d0f87f0e407a33',
        username: 'test',
        roles: ['user']
      };

      // Initialize the Contact us controller.
      ContactusController = $controller('ContactusController as vm', {
        $scope: $scope,
        contactuResolve: {}
      });
    }));

    describe('Submit Contact Us', function () {

      it('should have user context', inject(function (ContactusService) {
        expect($scope.vm.user).toBe(Authentication.user);
      }));

      it('should have user username when anonymous is false', inject(function (ContactusService) {
        $scope.vm.contactu.anonymous = false;
        $scope.vm.onSelectAnonymous();
        expect($scope.vm.contactu.username).toBe($scope.vm.user.username);
      }));

      it('should not have user username when anonymous is true', inject(function (ContactusService) {
        $scope.vm.contactu.anonymous = true;
        $scope.vm.onSelectAnonymous();
        expect($scope.vm.contactu.username).toBe('');
      }));

      it('should not have user username when anonymous is true and user exists', inject(function (ContactusService) {
        $scope.vm.contactu.anonymous = true;
        expect($scope.vm.user).toBe(Authentication.user);
        expect($scope.vm.contactu.username).toBe('');
      }));

      it('should not have user username when anonymous is false and user does not exist', inject(function (ContactusService) {
        $scope.vm.user = '';
        $scope.vm.contactu.anonymous = false;
        expect($scope.vm.contactu.username).toBe('');
      }));

      it('should not save and show error', inject(function (ContactusService) {
        $scope.vm.save(false);
        expect($scope.$broadcast).toHaveBeenCalledWith('show-errors-check-validity', 'vm.form.contactuForm');
      }));
    });

  });
}());
