'use strict';

// Declare app level module which depends on views, and components
angular.module('steempoll', [
  'ngRoute',
  'ngSanitize',
  'googlechart',
  'steempoll.polls',
  'steempoll.new',
  'steempoll.poll',
  'steempoll.version'
]).
config(['$locationProvider', '$routeProvider','$httpProvider', function($locationProvider, $routeProvider,$httpProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/polls'});
  /*$httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};*/
}])

.run(['$rootScope', '$timeout',function(){


}])
;
