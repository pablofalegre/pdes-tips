app.factory('assignments', ['$http', 'auth', function($http, auth){
  var o = {
    assignments: []
  };

  o.all = function() {
    return $http.get('/assignments').error(function(error){
	      console.log('error= ' + error);
	    }).success(function(data){

        console.log("assignments found = " + data);
        angular.copy(data, o.assignments);
    });
  };
  return o;
}]);