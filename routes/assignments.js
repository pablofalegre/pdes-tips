var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Assignment = mongoose.model('Assignment');

var fullAuth = require('./fullAuth');
var roles = require('../models/Roles');


router.get('/',function(req, res, next) {

  Assignment.find(function(err, assignments){
    if(err){ 
    	console.log("error getting assignments " + err);
    	return next(err); }
    res.json(assignments);
  });
});


router.post('/', fullAuth([roles.director]), function(req, res, next) {

  var assignment = new Assignment(req.body);

  assignment.save(function(err, idea){
    if(err){ return next(err); }
    	res.json(assignment);
  });
});


router.put('/:assignment/delete', fullAuth([roles.director]), function(req, res, next) {

	Assignment.findById(req.params.assignment).remove(function(err){
		if(err){ return next(err); }
		  res.json();
  	});
});

module.exports = router;