app.controller('ActivitiesCtrl', [
	'$scope',
	'activities',
	function($scope, activities){
		$scope.activities = activities.activities;
		$scope.home = function(){
			activities.recent();
		};

	}
]);