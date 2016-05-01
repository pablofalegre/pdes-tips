app.factory('activities', ['$http', 'auth', function($http, auth){
  var o = {
    activities: []
  };

  o.recent = function() {
  	console.log("calling recent");
    return $http.get('/activities').error(function(error){
	      $scope.error = error;
	    }).success(function(data){
      angular.copy(data, o.activities);
    });
  };
  return o;
}]);
