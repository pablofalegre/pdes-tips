var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Idea = mongoose.model('Idea');

router.get('/', function(req, res, next) {
  Idea.find({ 'state': 'en revision' }, function(err, pending_ideas){
    if(err){ return next(err); }

    res.json(pending_ideas);
  });
});

module.exports = router;
