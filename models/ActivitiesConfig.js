var mongoose = require('mongoose');
var Optional = require('optional-js');
var Activity = mongoose.model('Activity');


var createActivity = function(user, req, res, _action, _target){ 
      return new Activity({
          user : user,
          action : _action,
          target : _target
      });
}

//para cada url configuro un metodo y una actividad.
var activitiesConfig = {
  "/ideas" : {
  	POST : function(username, req, res){
      return createActivity(username, req, res, "subio una idea", req.body.title)
    }
  },
  "/ideas/:idea/postulate" : {
    PUT : function(username, req, res){
      return createActivity(username, req, res, "se postulo en", req.idea.title) 
    }
  },
  '/ideas/:idea/delete' : {
    PUT : function(username, req, res){
      return createActivity(username, req, res, "elimino una idea", req.idea.title)
    }
  },
  '/ideas/:idea/reject' : {
    PUT : function(username, req, res){
      return createActivity(username, req, res, "rechazo la idea", req.idea.title)
    }
  },
  '/ideas/:idea/accept' : {
    PUT : function(username, req, res){
      return createActivity(username, req, res, "acepto la idea", req.idea.title)
    }
  }
}


activitiesConfig.find = function(url, method){

	console.log('finding url ' + url + ', method = ' + method);

  if(this[url]){
    return Optional.ofNullable(this[url][method]);
  } else {
    return Optional.empty();
  }

}



module.exports = activitiesConfig;