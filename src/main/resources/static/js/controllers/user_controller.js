'use strict';

var cont = angular.module('logincontroller', ['LocalStorageModule'])

cont.controller('IndexController',
	    function($scope,$route,$routeParams, $http, $rootScope,localStorageService) {
});

cont.controller('SignupController',
	    function($scope,$route,$routeParams, $http, $rootScope, HttpServices,localStorageService) {
	$scope.signup = function(){
			HttpServices.saveUser($scope).
			then(function(_data){
				alert(_data.data.message)
			},function(error){
				alert(error.data.message)
			})
	}
});

cont.controller('LoginController',
	    function($scope,$location,$route,$routeParams, $http, $rootScope, HttpServices,
	    		localStorageService,AuthenticationService) {
	AuthenticationService.ClearCredentials();
	$scope.loginUser = function() {
			HttpServices.loginUser($scope).
			then(function(_data) {
				$scope.userId=_data.data.data.id;
				localStorageService.set('UserId',$scope.userId);
				AuthenticationService.SetCredentials($scope.email,$scope.password)
				$location.path('/profile');
			},function(error) {
				alert(error.data.message)
			})
	}
});

cont.controller('ProfileController',
	    function($scope,$route,$routeParams, $http, $rootScope, HttpServices,localStorageService) {
	$scope.userId = localStorageService.get('UserId');
	
	HttpServices.getUserProfile($scope).
	then(function(_data) {
		$scope.user=_data.data.data;
	},function(error) {
		alert(error.data.message)
	})
});