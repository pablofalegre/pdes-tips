app.controller('AssignmentCtrl', [
	'$scope',
	'assignments',
	'auth',
	function($scope, assignments, auth){

		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.assignments = assignments.assignments;
		$scope.id = '';

		$scope.home = function(){
			assignments.all();
		};

		$scope.saveAssignment = function(){
			if(!$scope.name || $scope.name === '') { return; }

			if($scope.id && $scope.id !== ''){
				assignments.update($scope.idx, {id : $scope.id,
					name: $scope.name});
			} else {
		  		assignments.save({
		  			name: $scope.name
					});
			}
			$scope.name  = '';
			$scope.id = '';
			$scope.idx = '';
		};

		$scope.delete = function(assignment){
			assignments.delete(assignment);
		};

		$scope.edit = function(assignment, idx){
			$scope.name = assignment.name;
			$scope.id = assignment._id;
			$scope.idx = idx;
		};
	}
]);