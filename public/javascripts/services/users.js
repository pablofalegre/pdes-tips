app.factory('users', ['$http', 'auth', function($http, auth){
  var o = {
 	
  };

  o.getUser = function() {
  		return $http.get('/users/currentuser').error(function(error){
		      console.log('error getting user =' + error);
		    }).success(function(data){
	      o.user = data;
	    });	
  	
  };

	var roles = {
		director : "Director",
		student : "Alumno",
		professor : "Profesor"
	};

	roles.hasRole = function(user, rol){
		return user.roles.indexOf(rol) >= 0;
	};

	o.isDirector = function(){
		return roles.hasRole(o.user, roles.director);
	};

	o.isProfessor = function(){
		return roles.hasRole(o.user, roles.professor);
	};

	o.isStudent = function(){
		return roles.hasRole(o.user, roles.student);
	};


  return o;
}]);
