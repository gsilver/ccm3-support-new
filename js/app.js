var canvasSupportApp = angular.module( "canvasSupportApp", ['ngRoute'] );

canvasSupportApp.run(function($rootScope) {
  $rootScope.token = '';
  $rootScope.yesToken = false;
  $rootScope.server = 'https://umich.test.instructure.com/';
});


canvasSupportApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'views/saa.html',
      controller: 'saaController'
    }).
    when('/util2', {
      templateUrl: 'views/personLookup.html',
      controller: 'personLookupController'
    }).
    when('/util3', {
      templateUrl: 'views/util3.html',
      controller: 'util3Controller'
    }).
    when('/util4', {
      templateUrl: 'views/util4.html',
      controller: 'util4Controller'
    }).
    when('/util5', {
      templateUrl: 'views/util5.html',
      controller: 'util5Controller'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]);
