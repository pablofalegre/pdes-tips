var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Idea = mongoose.model('Idea');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

function requestCallback(res, next) {
  return function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  }
}

function transitionIdeaState(req, res, next, stateMethodName) {
  req.idea[stateMethodName](req.payload.username, requestCallback(res, next));
}

router.get('/', function(req, res, next) {
  Idea.find({ 'state': {'$ne': 'eliminada'} }, function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});

router.post('/', auth, function(req, res, next) {
  var idea = new Idea(req.body);
  idea.author = req.payload.username;

  idea.save(function(err, idea){
    if(err){ return next(err); }

    res.json(idea);
  });
});

router.param('idea', function(req, res, next, id) {
  var query = Idea.findById(id);

  query.exec(function (err, idea){
    if (err) { return next(err); }
    if (!idea) { return next(new Error('can\'t find idea')); }

    req.idea = idea;
    return next();
  });
});

router.get('/:idea', function(req, res, next) {  
  res.json(req.idea);  
});

router.put('/:idea/postulate', auth, function(req, res, next) {
  req.idea.postulateUser(req.payload.username, requestCallback(res, next));
});

router.put('/:idea/accept', auth, function(req, res, next) {
  req.idea.accept(req.payload.username, requestCallback(res, next));  
});

router.put('/:idea/reject', auth, function(req, res, next) {
  transitionIdeaState(req, res, next, "reject")
});

router.put('/:idea/delete', auth, function(req, res, next) {
  req.idea.delete(req.payload.username, requestCallback(res, next));
});

module.exports = router;