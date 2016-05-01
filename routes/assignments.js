var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Assignment = mongoose.model('Assignment');


router.get('/', function(req, res, next) {
  Assignment.find(function(err, assignments){
    if(err){ 
    	console.log("error getting assignments " + err);
    	return next(err); }
    res.json(assignments);
  });
});

module.exports = router;