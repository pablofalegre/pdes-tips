app.factory('assignments', ['$http', 'auth', function($http, auth){
  var o = {
    assignments: []
  };

  var authHeader = function(){
    return {
        headers: {Authorization: 'Bearer '+auth.getToken()}
    };
  }

  o.all = function() {
    return $http.get('/assignments').error(function(error){
	      console.log('error getting assignments= ' + error);
	    }).success(function(data){

        angular.copy(data, o.assignments);
    });
  };

  o.add = function(assignment) {
    return $http.post('/assignments', assignment, authHeader()).success(function(data){
        o.assignments.push(data);
    });
  };

  o.delete = function(assignment) {
    return $http.put('/assignments/'+ assignment._id + '/delete', null, authHeader()).success(function(data){
      o.all();
    });
  };

  return o;
}]);