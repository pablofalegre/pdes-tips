app.controller('MainCtrl', [
	'$scope',
	'ideas',
	'auth',
	function($scope, ideas, auth){
		$scope.orderProperty = '-creationDate';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.ideas = ideas.ideas;	

		$scope.acceptPostulant = function(idea) {
			return idea.state==='disponible';
		};
		$scope.inReview = function(idea) {
			return idea.state==='en revision';
			};
		$scope.wasAccepted = function(idea) {
			return idea.state==='aceptada';
			};

		$scope.addIdea = function(){
			if(!$scope.title || $scope.title === '') { return; };
	  		ideas.create({
	  			title: $scope.title,
	  			description: $scope.description,
	  			state: "disponible" 
				});
				$scope.title  = '';
				$scope.description = '';
		}


}]);