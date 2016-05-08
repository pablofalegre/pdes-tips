var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Idea = mongoose.model('Idea');

var fullAuth = require('./fullAuth');
var roles = require('../models/Roles');

router.get('/', fullAuth([roles.director]), function(req, res, next) {
  Idea.find({ 'state': 'en revision' }, function(err, pending_ideas){
    if(err){ return next(err); }

    res.json(pending_ideas);
  });
});

module.exports = router;
