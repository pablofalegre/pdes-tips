app.controller('IdeasCtrl', [
	'$scope',
	'ideas',
	'idea',
	'auth',
	'$location',
	'users',
	function($scope, ideas, idea, auth, $location, users){

		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.idea = idea;
		$scope.acceptPostulant = function() {
			return idea.state==='disponible' && users.isStudent();
		};
		$scope.postulate = function(){
		  ideas.postulate(idea);
		};
		$scope.backToHome = function() {
	  	history.back();
		};
		$scope.canDelete = function() {
			return idea.state==='disponible' && (idea.author.username === auth.currentUser().username || users.isDirector());
		};
		$scope.delete = function() {
			ideas.delete(idea);
		};
	}
]);