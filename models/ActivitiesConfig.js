var mongoose = require('mongoose');
var Optional = require('optional-js');
var Activity = mongoose.model('Activity');

var activitiesConfig = {
  "/ideas" : {
    GET : function(username, req, res){ 
      return new Activity({
        user : username,
            action : "visito",
            target : "los posts"
      });
    }
  },
  "/ideas" : {
  	POST : function(username, req, res){ 
    	return new Activity({
        	user : username,
            action : "subio una idea",
            target : req.body.title
      });
    } 
  }
}


activitiesConfig.find = function(url, method){

	console.log('finding url ' + url + ', method = ' + method);

  if(this[url]){
    return Optional.ofNullable(this[url][method])
  } else {
    return Optional.NONE;
  }

}



module.exports = activitiesConfig;