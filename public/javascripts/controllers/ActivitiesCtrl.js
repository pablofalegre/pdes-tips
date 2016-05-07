app.controller('ActivitiesCtrl', [
	'$scope',
	'activities',
	function($scope, activities){
		console.log('ctrl activities');
		$scope.activities = activities.activities;
		$scope.home = function(){
			activities.recent();
		};

	}
]);