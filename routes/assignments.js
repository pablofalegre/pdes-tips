
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Assignment = mongoose.model('Assignment');

var fullAuth = require('./fullAuth');
var roles = require('../models/Roles');


router.get('/', function(req, res, next) {

    Assignment.find(function(err, assignments) {
        if (err) {
            console.log("error getting assignments " + err);
            return next(err);
        }
        res.json(assignments);
    });
});


router.post('/', fullAuth([roles.director]), function(req, res, next) {

    var assignment = new Assignment(req.body);

    console.log('req.id = ' + req.body.id);
    console.log('ass.id = ' + assignment._id);

    var cb = function(err) {
        if (err) {
            console.log("error saving assignment " + err);
            return next(err);
        }
        res.json(assignment);
    };

    if (req.body.id && req.body.id !== '') {
        Assignment.update({_id : req.body.id}, {name : req.body.name}, cb);
    } else {
      assignment.save(cb);
    }


});


router.put('/:assignment/delete', fullAuth([roles.director]), function(req, res, next) {

    Assignment.findById(req.params.assignment).remove(function(err) {
        if (err) {
            return next(err); }
        res.json();
    });
});

module.exports = router;
