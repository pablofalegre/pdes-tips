var mongoose = require('mongoose');

var Activity = mongoose.model('Activity');

var activitiesConfig = {
	"/ideas" : {
		"get" : function(username){ 
			return new Activity({
				user : username,
        		action : "visito",
        		target : "los posts"
			});
 		}
	}
}

module.exports = activitiesConfig;