var User = require('mongoose').model('User');

var loadUser = function(req, res, next){

	if (req.payload) {

   		var name = req.payload.username;
   		User.find({'username' : name}, function(err, found){
		    if(err){ 
		    	console.log("error finding user");	
		    	return next(err); }

			req.user = found[0];
			next();
		});
    } else {
    	next();
    }
    
}

//router.post('*', auth, loadUser);
//router.put('*', auth, loadUser);

module.exports = loadUser;