'use strict';

angular.module('httpservices', []).service('HttpServices', function($http, localStorageService){

	this.saveUser = function(scope) {	
		var formData = {
				"name": scope.name,
				"email": scope.email,
				"password": scope.password
		};	
		return $http.post('/user/add',formData); 
	}
	
	this.loginUser = function(scope) {	
		var formData = {
				"email": scope.email,
				"password": scope.password
		};	
		return $http.post('/user/login',formData); 
	}
	
	this.getUserProfile = function(scope) {	
		var url= '/user/'+scope.userId+'/getProfile';
		return $http.get(url); 
	}
	
});