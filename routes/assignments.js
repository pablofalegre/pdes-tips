var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Assignment = mongoose.model('Assignment');


router.get('/', function(req, res, next) {
  Assignment.find(function(err, assignments){
    if(err){ 
    	console.log("error getting assignments " + err);
    	return next(err); }
    res.json(assignments);
  });
});

router.post('/', auth, function(req, res, next) {
  var assignment = new Assignment(req.body);

  assignment.save(function(err, idea){
    if(err){ return next(err); }
    	res.json(assignment);
  });
});


router.put('/:assignment/delete', auth, function(req, res, next) {

	console.log("deleting assignment = " + req.params.assignment);

	Assignment.findById(req.params.assignment).remove(function(err){
		if(err){ return next(err); }
		res.json();
  	});
});

module.exports = router;