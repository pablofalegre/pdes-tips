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
		
	}
]);