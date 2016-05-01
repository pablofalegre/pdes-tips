//var app = angular.module('tpTips', ['ui.router','angularMoment']);


app.factory('ideas', ['$http', 'auth', function($http, auth){
  var o = {
    ideas: [],
    pending_ideas: []
  };
  o.home = function(){ 
  	return $http.get('/');
  };
  o.getAll = function() {
    return $http.get('/ideas').success(function(data){
      angular.copy(data, o.ideas);
    });
  };
  o.getPendingIdeas = function() {
    return $http.get('/pending_ideas').success(function(data){
      angular.copy(data, o.pending_ideas);
    });
  };
  o.get = function(id) {
	  return $http.get('/ideas/' + id).then(function(res){
	    return res.data;
	  });
	};
	o.postulate = function(idea) {
	  return $http.put('/ideas/'+ idea._id + '/postulate', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	  	idea.state = 'en revision';
	  });
	};
    var authHeader = {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	}

	o.accept = function(idea) {
	  return $http.put('/ideas/'+ idea._id + '/accept', null, authHeader).success(function(data){
	  	idea = data;
	  });
	};	
	o.reject = function(idea) {
	  return $http.put('/ideas/'+ idea._id + '/reject', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	  	idea.state = 'disponible';
	  	idea.postulant = undefined;
	  });
	};		
	o.create = function(idea) {
	  return $http.post('/ideas', idea, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    	o.ideas.push(data);
	  });
	};
	o.delete = function(idea) {
	  return $http.put('/ideas/'+ idea._id + '/delete', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	  	idea.state = 'eliminada';
	  });
	};

  return o;
}]);

