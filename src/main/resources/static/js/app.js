'use strict';

var myInterceptor = function($q,$rootScope) {
	  return {
	    request: function(config) {
	      console.log('requst started...'+config.url);
	      if(config.url != "checkUsername" && config.url != "checkUserPassword"){
	    	  if($rootScope.callCount == 0){
	    		//  $('#mydiv').show();
	    	  }
	      }
	      //$rootScope.start();
	      return config;
	    },

	    response: function(result) {
	      console.log('request completed');
	      if($rootScope.callCount <= 0){
	    	  if($rootScope.callCount < 0){
	    		  $rootScope.callCount = 0;
	    	  }
	      }
	      return result;
	    },
	    responseError: function(rejection) {
	      console.log('Failed with', rejection.status, 'status');
	      if($rootScope.callCount <= 0){
	    	  if($rootScope.callCount < 0){
	    		  $rootScope.callCount = 0;
	    	  }
	      }
	      return $q.reject(rejection);
	    }
	  }
	}

var mainApp = angular.module('app', ['logincontroller','httpservices','routing','ngCookies']).config(function($httpProvider) {
	  $httpProvider.interceptors.push(myInterceptor);
}).config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]).run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });
}]);

mainApp.factory('AuthenticationService',
	    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
	        function (Base64, $http, $cookieStore, $rootScope, $timeout) {
	            var service = {};

	            service.SetCredentials = function (email, password) {
	                var authdata = Base64.encode(email + ':' + password);
	     
	                $rootScope.globals = {
	                    currentUser: {
	                        email: email,
	                        authdata: authdata
	                    }
	                };
	     
	                
	                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
	               
	                $cookieStore.put('globals', $rootScope.globals);
	            };
	     
	            service.ClearCredentials = function () {
	                $rootScope.globals = {};
	                $cookieStore.remove('globals');
	                $http.defaults.headers.common.Authorization = 'Basic ';
	            };
	     
	            return service;
	        }])
	     
	    .factory('Base64', function () {
	        /* jshint ignore:start */
	     
	        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	     
	        return {
	            encode: function (input) {
	                var output = "";
	                var chr1, chr2, chr3 = "";
	                var enc1, enc2, enc3, enc4 = "";
	                var i = 0;
	     
	                do {
	                    chr1 = input.charCodeAt(i++);
	                    chr2 = input.charCodeAt(i++);
	                    chr3 = input.charCodeAt(i++);
	     
	                    enc1 = chr1 >> 2;
	                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	                    enc4 = chr3 & 63;
	     
	                    if (isNaN(chr2)) {
	                        enc3 = enc4 = 64;
	                    } else if (isNaN(chr3)) {
	                        enc4 = 64;
	                    }
	     
	                    output = output +
	                        keyStr.charAt(enc1) +
	                        keyStr.charAt(enc2) +
	                        keyStr.charAt(enc3) +
	                        keyStr.charAt(enc4);
	                    chr1 = chr2 = chr3 = "";
	                    enc1 = enc2 = enc3 = enc4 = "";
	                } while (i < input.length);
	     
	                return output;
	            },
	     
	            decode: function (input) {
	                var output = "";
	                var chr1, chr2, chr3 = "";
	                var enc1, enc2, enc3, enc4 = "";
	                var i = 0;
	     
	                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	                var base64test = /[^A-Za-z0-9\+\/\=]/g;
	                if (base64test.exec(input)) {
	                    window.alert("There were invalid base64 characters in the input text.\n" +
	                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
	                        "Expect errors in decoding.");
	                }
	                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	     
	                do {
	                    enc1 = keyStr.indexOf(input.charAt(i++));
	                    enc2 = keyStr.indexOf(input.charAt(i++));
	                    enc3 = keyStr.indexOf(input.charAt(i++));
	                    enc4 = keyStr.indexOf(input.charAt(i++));
	     
	                    chr1 = (enc1 << 2) | (enc2 >> 4);
	                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	                    chr3 = ((enc3 & 3) << 6) | enc4;
	     
	                    output = output + String.fromCharCode(chr1);
	     
	                    if (enc3 != 64) {
	                        output = output + String.fromCharCode(chr2);
	                    }
	                    if (enc4 != 64) {
	                        output = output + String.fromCharCode(chr3);
	                    }
	     
	                    chr1 = chr2 = chr3 = "";
	                    enc1 = enc2 = enc3 = enc4 = "";
	     
	                } while (i < input.length);
	     
	                return output;
	            }
	        };
	     
	        /* jshint ignore:end */
	    });
