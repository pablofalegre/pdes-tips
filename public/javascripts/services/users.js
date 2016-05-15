app.factory('users', ['$http', 'auth', function($http, auth){
  var o = {
 	
  };

	var roles = {
		director : "Director",
		student : "Alumno",
		professor : "Profesor"
	};

	roles.hasRole = function(roles, rol){
		return roles.indexOf(rol) >= 0;
	};

	o.isDirector = function(){
		return roles.hasRole(auth.currentUser().roles, roles.director);
	};

	o.isProfessor = function(){
			return roles.hasRole(auth.currentUser().roles, roles.professor);	
	};

	o.isStudent = function(){
		return roles.hasRole(auth.currentUser().roles, roles.student);
	};

	o.userRoles = function(){
		return auth.currentUser().roles;
	}

  return o;
}]);
