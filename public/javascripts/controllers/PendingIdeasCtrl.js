app.controller('PendingIdeasCtrl', [
	'$scope',
	'ideas',
	'auth',
	'$location',
	function($scope, ideas, auth, $location){
		$scope.orderProperty = '-creationDate';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.ideas = ideas.pending_ideas;
		$scope.home = function(){
			ideas.home();
		};	
		$scope.backToHome = function() {

	  	$location.path('/');
		};
		$scope.acceptIdea = function(idea){
		  ideas.accept(idea).success(function(data) {
		    var index = $scope.ideas.indexOf(idea);
  			$scope.ideas.splice(index, 1); 
		  });
		};
		$scope.rejectIdea = function(idea){
		  ideas.reject(idea).success(function(data) {
		    var index = $scope.ideas.indexOf(idea);
  			$scope.ideas.splice(index, 1); 
		  });
		};	
	}
]);
