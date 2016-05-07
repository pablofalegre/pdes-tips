var roles = {
	director : "Director",
	student : "Alumno",
	professor : "Profesor"
};

roles.hasRole = function(user, rol){
	return user.roles.indexOf(rol) >= 0;
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