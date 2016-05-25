var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Idea = mongoose.model('Idea');
var fullAuth = require('./fullAuth');
var roles = require('../models/Roles');


function requestCallback(res, next) {
  return function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  };
}

function transitionIdeaState(req, res, next, stateMethodName) {
  req.idea[stateMethodName](req.payload.username, requestCallback(res, next));
}

router.get('/', function(req, res, next) {
  Idea.find({ 'state': {'$ne': 'eliminada'} })
  .populate('author')
  .populate('postulant')
  .populate('assignments')
  .exec(function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});


router.post('/', fullAuth([roles.professor]), function(req, res, next) {

  var idea = new Idea(req.body);
  idea.author = req.user;

  idea.save(function(err, idea){
    if(err){ return next(err); }

    res.json(idea);
  });
});

router.param('idea', function(req, res, next, id) {
  var query = Idea.findById(id)
  .populate('author')
  .populate('postulant')
  .populate('assignments');

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


router.put('/:idea/postulate', fullAuth([roles.student]), function(req, res, next) {
  req.idea.postulateUser(req.user, requestCallback(res, next));
});

router.put('/:idea/accept', fullAuth([roles.director]),function(req, res, next) {
  req.idea.accept(req.user, requestCallback(res, next));
});

router.put('/:idea/reject', fullAuth([roles.director]),function(req, res, next) {
  req.idea.reject(req.user, requestCallback(res, next));
});

router.put('/:idea/delete', fullAuth([roles.professor, roles.director]),function(req, res, next) {
  req.idea.delete(req.user, requestCallback(res, next));
});

module.exports = router;
