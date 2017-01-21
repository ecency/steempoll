'use strict';

angular.module('steempoll.poll', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/poll/:permlink', {
    templateUrl: 'poll/poll.html',
    controller: 'PollCtrl'
  });
}])

.controller('PollCtrl', function($scope, $routeParams, APIs) {

  var stripData = function(text){
    var stripchoices = text.split(/<chs>/);
    var jchs = stripchoices[0]+stripchoices[2];
    var stripinstructions = jchs.split(/<ein>/);
    return stripinstructions[0]+stripinstructions[2];
  }
  $scope.castingVote = false;
  $scope.user = {};
  $scope.castVote = function(){
    //console.log($scope.user.choice);
    if($scope.castingVote) {
      $scope.castingVote = false;
    } else {
      var numchs = $scope.poll.choices.length;
      var per = Math.round(100/numchs);
      $scope.user.finalc = $scope.user.choice.substring(6);
      $scope.user.percent = per*Number($scope.user.finalc)-1;
      $scope.castingVote = true;
    }
  }
  $scope.confirmVote = function(){
    var perc = $scope.user.percent*100;
    var wif = steem.auth.isWif($scope.user.wif) ? $scope.user.wif : steem.auth.toWif($scope.user.voter, $scope.user.wif, 'posting');

    steem.broadcast.vote(wif, $scope.user.voter, "steempoll", $routeParams.permlink, perc, function(err, result) {
        //console.log(err, result);
        if (result) {
          $scope.castingVote = false;
          $scope.user.wif = "";
          alert('Voted on Answer: '+$scope.user.finalc);
        }
        if (err) {
          if (err.message.indexOf('already voted')>-1){
            alert('You have already voted on Answer: '+$scope.user.finalc);
          } else if (err.message.indexOf("weight is too")){
            alert("Voting weight is too small, please accumulate more voting power or steem power!")
          } else {
            alert('Error casting Vote!');
          }

        }
    });
  };
  $scope.results = false;
  $scope.showResults = function(){
    if ($scope.results) {
      $scope.results = false;
    } else {
      $scope.results = true;
      //console.log($scope.post.active_votes);
      var siz = $scope.poll.choices.length;
      var per = Math.round(100/siz);
      $scope.rows = [];
      for (var i = 0; i < siz; i++) {
        $scope.rows.push({c:[{v: $scope.poll.choices[i].name},{v: 0}]});
      }
      setTimeout(function () {
        //console.log($scope.rows);
        angular.forEach($scope.post.active_votes, function(v,k){
          var aper = v.percent/100;
          var ind = Math.floor(aper/per);
          if ($scope.rows[ind]) {
            $scope.rows[ind].c[1].v++;
          }
        })

        //chart
        $scope.barObject = {};
        $scope.barObject.type = "BarChart";
        $scope.barObject.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Votes", type: "number"}
        ], "rows": $scope.rows};

        $scope.barObject.options = {
            'title': $scope.poll.title
        };
      }, 10);
    }
  }
  if ($routeParams.permlink) {
    steem.api.getContent("steempoll", $routeParams.permlink, function(err, result) {
      if (err) {
        alert('Error fetching post, please reload the page!');
      }
      if (result) {
        result.json_metadata = angular.fromJson(result.json_metadata)||[];
        result.body = stripData(result.body);
        $scope.post = result;
        if (result.json_metadata.tags) {
          if (result.json_metadata.pollid) {
            APIs.getPoll(result.json_metadata.pollid).then(function(res){
              $scope.poll = res.data;
            });
          } else {
            $scope.user.annon = true;
          }
        } else {
          result.json_metadata = angular.fromJson(angular.fromJson(result.json_metadata));
          if (result.json_metadata.pollid) {
            APIs.getPoll(result.json_metadata.pollid).then(function(res){
              $scope.poll = res.data;
            });
          } else {
            $scope.user.annon = true;
          }
        }
        
      }
      if (!$scope.$$phase){
        $scope.$apply();
      }
    });
  }
});
