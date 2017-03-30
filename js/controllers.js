canvasSupportApp.controller('navController', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $scope.setToken = function() {
    $rootScope.token = $scope.token;
    $rootScope.yesToken = true;
  };

}]);




canvasSupportApp.controller('saaController', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $scope.getAccount = function(id) {
    getStuff.getSubAccounts(id, $scope.token).then(function(accountData) {
      if (id === 1) {
        $scope.accounts = accountData.data;
      } else {
        var parent = _.findWhere($scope.accounts, {id: id});
        var parentIndex = _.findIndex($scope.accounts, {id: id}) + 1;
        $scope.accounts[parentIndex - 1].subsRequested=true;
        if(accountData.data.length){
          _.each(accountData.data, function(subaccount){
            if(parent.depth){
              subaccount.depth = parent.depth * 2;
            }
            else {
              subaccount.depth = 2;
            }
            subaccount.admins=[];
            $scope.accounts.splice(parentIndex,0, subaccount);
          });
        } else {
          $scope.accounts[parentIndex - 1].nosubs=true;
        }
      }
    });
  };

  $scope.getAdmins = function(id) {
    getStuff.getSubAccountAdmins(id).then(function(adminsData) {
      var accountIndex = _.findIndex($scope.accounts, {id: id});
      $scope.accounts[accountIndex].adminsRequested = true;
      $scope.accounts[accountIndex].admins = adminsData.data;
    });
  };
}]);

canvasSupportApp.controller('personLookupController', ['$rootScope', '$scope', '$filter', '$timeout', '$log', '$sce', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, $sce, getStuff) {

  $scope.renderHtml = function (htmlCode) {
    return $sce.trustAsHtml(htmlCode);
  };

  $scope.lookUpPerson = function(){
    var person_url ='/api/v1/accounts/self/users?search_term=' + $scope.uniqname;
    getStuff.getGenericStuff(person_url).then(function(personData) {
      $scope.personList = personData.data;
    });
  };
  $scope.getDetails = function(id){
    var details_url ='/api/v1/users/' + id +  '/profile';
    getStuff.getGenericStuff(details_url).then(function(personData) {
      $scope.appendToPerson(id, 'details', personData);
    });
  };
  //as_user_id=sis_user_id
  $scope.getStream = function(id){
    var stream_url ='/api/v1/users/self/activity_stream?as_user_id=sis_user_id:' + id ;
    getStuff.getGenericStuff(stream_url).then(function(streamData) {
      $scope.appendToPerson(id, 'stream', streamData);
    });
  };

  $scope.getToDoList = function(id){
    var todo_url ='/api/v1/users/self/todo?as_user_id=sis_user_id:' + id ;
    getStuff.getGenericStuff(todo_url).then(function(todoData) {
      $scope.appendToPerson(id, 'todo', todoData);
    });
  };
  $scope.getMissing = function(id){
    var missing_url ='/api/v1/users/'+ id +'/missing_submissions';
    getStuff.getGenericStuff(missing_url).then(function(missingData) {
      $scope.appendToPerson(id, 'missing', missingData);
    });
  };
  $scope.getPages = function(id){
    var pages_url ='/api/v1/users/'+ id +'/page_views';
    getStuff.getGenericStuff(pages_url).then(function(pagesData) {
      $scope.appendToPerson(id, 'pages', pagesData);
    });
  };

  $scope.appendToPerson = function(id, where, data){
    var personPos;
    if(where ==='stream' || where ==='todo'){
      personPos = $scope.personList.indexOf(_.findWhere($scope.personList, {sis_user_id: id}));
    }
    else {
      personPos = $scope.personList.indexOf(_.findWhere($scope.personList, {id: id}));
    }
    $scope.personList[personPos][where]= data.data;
  };

}]);

canvasSupportApp.controller('util3Controller', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $log.info('3');
}]);

canvasSupportApp.controller('util4Controller', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $log.info('4');
}]);

canvasSupportApp.controller('util5Controller', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $log.info('5');
}]);
