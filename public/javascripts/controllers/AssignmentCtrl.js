app.controller('AssignmentCtrl', [
	'$scope',
	'assignments',
	'auth',
	function($scope, assignments, auth){

		console.log("assignments ctrol");
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.assignments = assignments.assignments;

		$scope.home = function(){
			assignments.all();
		};
		

		$scope.addAssignment = function(){
			if(!$scope.name || $scope.name === '') { return; };
	  		assignments.add({
	  			name: $scope.name 
				});
			$scope.name  = '';
				
		}

		$scope.delete = function(assignment){
			assignments.delete(assignment);	
		}
	}
]);