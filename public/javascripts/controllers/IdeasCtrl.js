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
			console.log("idea.author.username= " + idea.author.username);
			console.log("idea.author.username= " + auth.currentUser());
			return idea.state==='disponible' && idea.author.username === auth.currentUser();
		};
		$scope.delete = function() {
			ideas.delete(idea);
		};
	}
]);