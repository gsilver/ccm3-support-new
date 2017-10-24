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
        var parent = _.findWhere($scope.accounts, {
          id: id
        });
        var parentIndex = _.findIndex($scope.accounts, {
          id: id
        }) + 1;
        $scope.accounts[parentIndex - 1].subsRequested = true;
        if (accountData.data.length) {
          _.each(accountData.data, function(subaccount) {
            if (parent.depth) {
              subaccount.depth = parent.depth * 2;
            } else {
              subaccount.depth = 2;
            }
            subaccount.admins = [];
            $scope.accounts.splice(parentIndex, 0, subaccount);
          });
        } else {
          $scope.accounts[parentIndex - 1].nosubs = true;
        }
      }
    });
  };

  $scope.getAdmins = function(id) {
    getStuff.getSubAccountAdmins(id).then(function(adminsData) {
      var accountIndex = _.findIndex($scope.accounts, {
        id: id
      });
      $scope.accounts[accountIndex].adminsRequested = true;
      $scope.accounts[accountIndex].admins = adminsData.data;
    });
  };
}]);

canvasSupportApp.controller('personLookupController', ['$rootScope', '$scope', '$filter', '$timeout', '$log', '$sce', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, $sce, getStuff) {

  $scope.renderHtml = function(htmlCode) {
    return $sce.trustAsHtml(htmlCode);
  };

  $scope.lookUpPerson = function() {
    var person_url = '/api/v1/accounts/self/users?search_term=' + $scope.uniqname;
    getStuff.getGenericStuff(person_url).then(function(personData) {
      $scope.personList = personData.data;
    });
  };
  $scope.getDetails = function(id) {
    var details_url = '/api/v1/users/' + id + '/profile';
    getStuff.getGenericStuff(details_url).then(function(personData) {
      $scope.appendToPerson(id, 'details', personData);
    });
  };
  //as_user_id=sis_user_id
  $scope.getStream = function(id) {
    var stream_url = '/api/v1/users/self/activity_stream?as_user_id=sis_user_id:' + id;
    getStuff.getGenericStuff(stream_url).then(function(streamData) {
      $scope.appendToPerson(id, 'stream', streamData);
    });
  };

  $scope.getToDoList = function(id) {
    var todo_url = '/api/v1/users/self/todo?as_user_id=sis_user_id:' + id;
    getStuff.getGenericStuff(todo_url).then(function(todoData) {
      $scope.appendToPerson(id, 'todo', todoData);
    });
  };
  $scope.getMissing = function(id) {
    var missing_url = '/api/v1/users/' + id + '/missing_submissions';
    getStuff.getGenericStuff(missing_url).then(function(missingData) {
      $scope.appendToPerson(id, 'missing', missingData);
    });
  };
  $scope.getPages = function(id) {
    var pages_url = '/api/v1/users/' + id + '/page_views';
    getStuff.getGenericStuff(pages_url).then(function(pagesData) {
      $scope.appendToPerson(id, 'pages', pagesData);
    });
  };

  $scope.appendToPerson = function(id, where, data) {
    var personPos;
    if (where === 'stream' || where === 'todo') {
      personPos = $scope.personList.indexOf(_.findWhere($scope.personList, {
        sis_user_id: id
      }));
    } else {
      personPos = $scope.personList.indexOf(_.findWhere($scope.personList, {
        id: id
      }));
    }
    $scope.personList[personPos][where] = data.data;
  };

}]);

canvasSupportApp.controller('mlatController', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'Things', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, Things, getStuff) {

  $scope.started = false;
  $scope.courseId = '';
  $scope.quizArray = [];
  $scope.selectedQuizzes = [];
  $scope.columns = [];
  $scope.selectedColumns = {
    "sis_user_id": true,
    "sis_login_id": true,
    "sortable_name": false
  };
  $scope.startOver = function(){
    $scope.quizArray =[];
    $scope.assListTotal =[];
    $scope.columns = [];
    $scope.selectedQuizzes = [];
    $scope.done = false;
    $scope.started = false;
  };


  $scope.getAssignments = function() {
    var assUrl = '/api/v1/courses/' + $scope.courseId + '/assignments?include[]=submission';
    getStuff.getGenericStuff(assUrl).then(function(assList) {
      if (assList.status === 200){
      $scope.quizArray = _.map(assList.data, function(o) {
        return _.pick(o, 'id', 'name', 'quiz_id');
      });
    } else {
      if(assList.status === 401){
        $scope.courseError = assList.data.errors[0].message;
      } else if(assList.status === 404)
      $scope.courseError ='Either the course ID is invalid or you do not have the right permissions.';
    }
    });
  };


  $scope.getQuizList = function() {
    $scope.assListTotal = [];
    _.each($scope.quizArray, function(ass, i) {
      $scope.started = true;
      Things.getThings('/api/v1/courses/' + $scope.courseId + '/assignments/' + ass.id + '/submissions?per_page=100&include[]=user&grouped=true')
        .then(function(submissList) {
          _.each(submissList.data, function(sub) {
            $scope.assListTotal.push(sub);
          });
          if (i + 1 === $scope.quizArray.length) {
            $scope.done = true;
          }
        });
    });

    $scope.$watch('done', function() {
      if ($scope.done) {
        var user_list_simp = _.uniq(_.pluck($scope.assListTotal, 'user'), _.property('id'));
        _.each($scope.assListTotal, function(sub_item) {
          if (sub_item.body) {
            var quiz = sub_item.body.split(',')[1].split(':')[1].trim();
            var match = _.findWhere(user_list_simp, {
              sis_login_id: sub_item.user.sis_login_id
            });
            if (match) {
              match[quiz] = sub_item.score;
            }
          }
        });

        $scope.assListTotal = user_list_simp;
        _.each($scope.assListTotal, function(row) {
          row.cols =[];
          _.each($scope.columns, function(col) {
            var name = col.name;
            var add = 0;
            _.each(col.quiz_ids, function(quiz_id){
              add = add + row[quiz_id];
            });
            row.cols.push({name:name, calc:add});
          });
        });

        $scope.assListTotal = _.map($scope.assListTotal, function(o) {
           return _.pick(o,'sis_login_id', 'sis_user_id', 'sortable_name', 'cols');
        });

         $scope.empties = _.filter($scope.assListTotal, function(o) {
           return isNaN(o.cols[0].calc);
         });
      }
    });


    $scope.removeEmpties = function() {
      $scope.assListTotal = _.filter($scope.assListTotal, function(o) {
        return !isNaN(o.cols[0].calc);
      });
      $scope.empties = [];
    };

    $scope.startExport = function() {
      $scope.exportStarted = true;
    };

    $scope.concludeExport = function() {
      var exportable = JSON.parse(angular.toJson($scope.assListTotal));
      var newCols = [];
      _.each(exportable, function(row){
        _.each(row.cols, function(col){
          row[col.name] = col.calc;
          newCols.push(col.name);
        });
        delete row.cols;
      });

      newCols = _.uniq(newCols);
      var userSelectedColumns = [];
      _.each($scope.selectedColumns, function(val, key) {
        if (val) {
          userSelectedColumns.push(key);
        }
      });

      userSelectedColumns = _.union(userSelectedColumns, newCols);

      var trimmedExportable = _.map(exportable, function(o) {
        return _.pick(o, userSelectedColumns);
      });

      var csv = Papa.unparse(trimmedExportable, [{
        quotes: false,
        quoteChar: '"',
        delimiter: ",",
        header: true,
        newline: "\r\n"
      }]);


      downloadCSVFile(csv);

      function downloadCSVFile(csv) {
        var nowStamp = moment().format('MMMM-Do-YYYY_h-mm_ss_a');
        $scope.downloading = true;
        // credit: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
        var csvContent = "data:text/csv;charset=utf-8," + csv;
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", 'mlat-export' + nowStamp + '.csv');
        document.body.appendChild(link); // Required for FF
        $timeout(function() {
          link.click();
          $scope.downloading = false;
        }, 1000);
      }

    };
  };

  $scope.addColumn = function(){
    var newColumn ={name:$scope.newColName, ids:[],names:[], quiz_ids:[]};
    angular.forEach($scope.quizArray, function (quiz) {
        if (quiz.selected) {
          newColumn.ids.push(quiz.id);
          newColumn.names.push(quiz.name);
          newColumn.quiz_ids.push(quiz.quiz_id);
        }
    });
    if(($scope.newColName !=='' && typeof $scope.newColName !=='undefined') && newColumn.names.length ){
        $scope.columns.push(newColumn);
        $scope.newColumnError = false;
        // clean up
        angular.forEach($scope.quizArray, function (quiz) {
          quiz.selected = false;
        });
        $scope.newColName ='';
    } else {
      $scope.newColumnError = true;
    }
  };

}]);

canvasSupportApp.controller('util4Controller', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $log.info('4');
}]);

canvasSupportApp.controller('util5Controller', ['$rootScope', '$scope', '$filter', '$timeout', '$log', 'getStuff', function($rootScope, $scope, $filter, $timeout, $log, getStuff) {
  $log.info('5');
}]);
