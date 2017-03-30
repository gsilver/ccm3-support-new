'use strict';

/* global canvasSupportApp, calculateDepth */

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
