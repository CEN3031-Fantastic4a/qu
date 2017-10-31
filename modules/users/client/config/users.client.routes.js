(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('settings.parking', {
        url: '/manage-parking',
        templateUrl: '/modules/users/client/views/settings/manage-parking.client.view.html',
        controller: 'ManageParkingListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings manage parking'
        }
      })
      .state('settings.parking.create', {
        url: '/create',
        templateUrl: '/modules/users/client/views/settings/manage-parking/parking-create.client.view.html',
        controller: 'ManageParkingController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings create parking'
        },
        resolve: {
          parkingResolve: newParking
        }
      })
      .state('settings.parking.details', {
        url: '/:spotId',
        templateUrl: '/modules/users/client/views/settings/manage-parking/parking-details.client.view.html',
        controller: 'ManageParkingDetailsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings view parking'
        },
        resolve: {
          parkingResolve: getParking
        }
      })
      .state('settings.parking.edit', {
        url: '/:spotId/edit',
        templateUrl: '/modules/users/client/views/settings/manage-parking/parking-edit.client.view.html',
        controller: 'ManageParkingController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings edit parking'
        },
        resolve: {
          parkingResolve: getParking
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      });
  }

  getParking.$inject = ['$stateParams', 'ManageParkingService'];

  function getParking($stateParams, ManageParkingService) {
    return ManageParkingService.get({
      spotId: $stateParams.spotId
    }).$promise;
  }

  newParking.$inject = ['ManageParkingService'];

  function newParking(ManageParkingService) {
    return new ManageParkingService();
  }
}());
