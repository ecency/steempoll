'use strict';

angular.module('steempoll.polls', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/polls', {
    templateUrl: 'polls/polls.html',
    controller: 'PollsCtrl'
  });
}])

.controller('PollsCtrl', function($scope) {

  //console.log('polls');

  steem.api.getDiscussionsByBlog({tag:"demo", limit:15}, function(err, response) {
    //console.log(err, response);
    if (err) {
      alert('Connection issue, please reload the page!');
    }
    if(response) {
      angular.forEach(response, function(v,k){
        v.json_metadata = v.json_metadata?angular.fromJson(v.json_metadata):v.json_metadata;
      });
      $scope.list = response;
      if (!$scope.$$phase){
        $scope.$apply();
      }
    }
  });
  $scope.tt = [];

  steem.api.getState("/@good-karma/transfers", function(err, result) {
    //console.log(err, result);
    //console.log(result.accounts["good-karma"].transfer_history);
    var response = result.accounts["good-karma"].transfer_history;
    angular.forEach(response, function(v,k){
      //console.log(v[1].op[0]);
      if (v[1].op[0] === "transfer"){
        //if (v[1].op[1].from === "good-karma"){
          $scope.tt.push(v);
        //}
      }
    });
    setTimeout(function () {
      //console.log($scope.tt);
    }, 20);
  });


});
