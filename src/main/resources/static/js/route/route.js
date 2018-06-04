'use strict';

angular.module('routing', [ 'ngRoute' ]).config(
		[ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl: 'loginPage',
                controller: 'LoginController'
			}).
            when('/login', {
                templateUrl: 'loginPage',
                controller: 'LoginController'
            }).when('/signup', {
                templateUrl: 'signupPage',
                controller: 'SignupController'
            }).when('/profile', {
                templateUrl: 'profilePage',
                controller: 'ProfileController'
            }).otherwise({redirectTo:'/'});
		}]);


