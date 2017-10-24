var canvasSupportApp = angular.module( "canvasSupportApp", ['ngRoute'] );

canvasSupportApp.run(function($rootScope) {
  $rootScope.token = '';
  $rootScope.yesToken = false;
  $rootScope.server = 'https://umich.test.instructure.com/';
  $rootScope.server.prod = 'https://umich.instructure.com/';
});

canvasSupportApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'views/mlat.html',
      controller: 'mlatController'
    }).
    when('/util2', {
      templateUrl: 'views/mlat.html',
      controller: 'mlatController'
    }).
    when('/util3', {
      templateUrl: 'views/mlat.html',
      controller: 'mlatController'
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
