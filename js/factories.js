'use strict';

/* global canvasSupportApp, calculateDepth,  parseLinkHeader */

canvasSupportApp.factory('getStuff', function ($http, $rootScope, $log) {
  return {
    getGenericStuff: function (url) {
      return $http.get(url, {
        headers: {
        "Authorization": "Bearer " + $rootScope.token
        }
      }).then(
        function success(result) {
          return result;
        },
        function error(result) {
          $log.warn(url, result.status, result.data.errors);
          return result;
        }
      );
    },
    getSubAccounts: function (subAccountId) {
      var url = '/api/v1/accounts/' + subAccountId + '/sub_accounts?per_page=200';
      return $http.get(url, {
        headers: {
        "Authorization": "Bearer " + $rootScope.token
        }
      }).then(
        function success(result) {
          return result;
        },
        function error(result) {
          $log.warn(url, result.status, result.data.errors);
          return result;
        }
      );
    },

    getSubAccountAdmins: function (subAccountId) {
      var url = '/api/v1/accounts/' + subAccountId + '/admins?per_page=200';

      return $http.get(url, {
          headers: {
            "Authorization": "Bearer " + $rootScope.token
          }
        }).then(
        function success(result) {
          return result;
        },
        function error(result) {
          $log.warn(url, result.status, result.data.errors);
          return result;
        }
      );
    },
  };
});

//GENERIC GETTER of paged things
canvasSupportApp.factory('Things', function ($http, $q, $rootScope, $log) {
  var getThings = function(url) {
    var things = [];
    var deferred = $q.defer();
    var getNext = function(url) {
      $http.get(url, {
          headers: {
            "Authorization": "Bearer " + $rootScope.token
          }
        })
        .then(function(result) {
          things = things.concat(result.data);
          var r = parseLinkHeader(result.headers('Link'));
          if (r.next) {
            getNext(decodeURIComponent(r.next.href.replace('https://umich.test.instructure.com','')));
          } else {
            result.data = things;
            deferred.resolve(result);
          }
        }, function(result) {
            deferred.resolve(result);
        });
    };
    getNext(url);
    return deferred.promise;
  };

  return {
    getThings: function(url) {
      return getThings(url);
    }
  };
});
