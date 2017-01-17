'use strict';

angular.module('steempoll.new', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/new', {
    templateUrl: 'new/new.html',
    controller: 'NewCtrl'
  });
}])

.controller('NewCtrl', function($scope, APIs) {
  //console.log('new');

  $scope.progress = 0;
  $scope.data = {};
  $scope.data.choices = [{id: 'choice1'}, {id: 'choice2'}];

  $scope.focus = function(){
    var ol = Object.keys($scope.data);
    $scope.progress = ol.length*20;
  };

  $scope.addNewChoice = function() {
    var newItemNo = $scope.data.choices.length+1;
    $scope.data.choices.push({'id':'choice'+newItemNo});
  };

  $scope.removeChoice = function() {
    var lastItem = $scope.data.choices.length-1;
    $scope.data.choices.splice(lastItem);
  };
  $scope.result = {};
  $scope.submitPoll = function(){
    if (angular.isDefined($scope.data.title) && angular.isDefined($scope.data.description) && angular.isDefined($scope.data.preferences) && $scope.data.choices.length>1) {
      APIs.addPoll($scope.data).then(function(res){
        console.log(res);
        $scope.result = res.data;
        if (res.status === 200){
          console.log('success '+res.data._id);
          $scope.data = {};
        } else {
          alert('failed');
        }
      });
    } else {
      alert('Title, Description and Preference, must be filled! At least 2 options should be added!');
    }
  };
});
