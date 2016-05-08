var roles = {
	director : "Director",
	student : "Alumno",
	professor : "Profesor"
};

roles.hasRole = function(user, rol){
	return user.roles.indexOf(rol) >= 0;
};

roles.hasOneRole = function(user, _roles){

	var hasRole = false;

	for (var i = _roles.length - 1; i >= 0; i--) {
		hasRole = hasRole || this.hasRole(user, _roles[i]);
	};

	return hasRole;
};

roles.isDirector = function(user){
	return this.hasRole(user, this.director);
};

roles.isProfessor = function(user){
	return this.hasRole(user, this.professor);
};

roles.isStudent = function(user){
	return this.hasRole(user, this.student);
};

roles.all = function(){
	return [this.director, this.student, this.professor];
}

module.exports = roles;