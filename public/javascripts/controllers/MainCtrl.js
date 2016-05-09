app.controller('MainCtrl', [
	'$scope',
	'ideas',
	'auth',
	'assignments',
	'users',
	function($scope, ideas, auth, assignments, users){
		
		$scope.orderProperty = '-creationDate';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.ideas = ideas.ideas;
		$scope.ideaAssignments = [];
		$scope.allAssignments = assignments.assignments;
		$scope.tmpLinks = [];
		$scope.url = {text: ""};

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
	  			state: "disponible",
	  			assignments: $scope.ideaAssignments,
	  			links: $scope.tmpLinks
			});
			$scope.title  = '';
			$scope.description = '';
			$scope.ideaAssignments = [];
			$scope.tmpLinks = [];
		};

		$scope.groupAssignment = function(assignment){

			if($scope.ideaAssignments.indexOf(assignment) >= 0){
			} else {
				$scope.ideaAssignments.push(assignment);	
			}
			
		};

		$scope.isStudent = function(){
			return users.isStudent();
		};
		$scope.isProfessor = function(){
			return users.isProfessor();
		};
		$scope.isDirector = function(){
			return users.isDirector();
		}

		$scope.addLink = function(){
			if(!$scope.ideaForm.$invalid && $scope.url.text != ''
				&& $scope.tmpLinks.indexOf($scope.url.text) < 0){
				$scope.tmpLinks.push($scope.url.text);
				$scope.url.text = "";
			}
		}

}]);