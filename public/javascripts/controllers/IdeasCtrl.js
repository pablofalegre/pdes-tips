app.controller('IdeasCtrl', [
	'$scope',
	'ideas',
	'idea',
	'auth',
	'$location',
	function($scope, ideas, idea, auth, $location){

		console.log('ideas ctrl');

		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.idea = idea;
		$scope.acceptPostulant = function() {
			return idea.state==='disponible';
		};
		$scope.postulate = function(){
		  ideas.postulate(idea);
		};
		$scope.backToHome = function() {
	  	history.back();
		};
		$scope.canDelete = function() {
			return idea.state==='disponible' && idea.author === auth.currentUser();
		};
		$scope.delete = function() {
			ideas.delete(idea);
		};
	}
]);