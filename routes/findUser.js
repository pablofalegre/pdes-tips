var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


var loadUser = function(req, res, next){
	if (req.payload) {

   		var name = req.payload.username;
   		User.find({'username' : name}, function(err, found){
		    if(err){ return next(err); }

			req.user = found[0];

			next();
		});
    }
}

router.post('*', auth, loadUser);
router.put('*', auth, loadUser);

module.exports = router;