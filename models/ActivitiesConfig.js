var mongoose = require('mongoose');
var Optional = require('optional-js');
var Activity = mongoose.model('Activity');

var activitiesConfig = {
  "/ideas" : {
    GET : function(username){ 
      return new Activity({
        user : username,
            action : "visito",
            target : "los posts"
      });
    }
  },
  "/ideas" : {
  	POST : function(username){ 
    	return new Activity({
        	user : username,
            action : "subio",
            target : "una idea"
      });
    } 
  }
}


activitiesConfig.find = function(url, method){

	var optMethod = function(endpoint){
		console.log("found method " + endpoint[method]);
		return Optional.ofNullable(endpoint[method]);	
	}

	console.log('finding url ' + url + ', method = ' + method);

	return Optional.ofNullable(this[url])
		.map(optMethod);
}



module.exports = activitiesConfig;