var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Activity = mongoose.model('Activity');
var Idea = mongoose.model('Idea');
var User = mongoose.model('User');


function requestCallback(res, next) {
  return function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  }
}

function transitionIdeaState(req, res, next, stateMethodName) {
  req.idea[stateMethodName](req.payload.username, requestCallback(res, next));
}

router.get('/ideas', function(req, res, next) {
  Idea.find({ 'state': {'$ne': 'eliminada'} }, function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});

router.post('/ideas', auth, function(req, res, next) {
  var idea = new Idea(req.body);
  idea.author = req.payload.username;

  idea.save(function(err, idea){
    if(err){ return next(err); }

    res.json(idea);
  });
});


router.get('/pending_ideas', function(req, res, next) {
  Idea.find({ 'state': 'en revision' }, function(err, pending_ideas){
    if(err){ return next(err); }

    res.json(pending_ideas);
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

router.get('/ideas/:idea', function(req, res, next) {  
  res.json(req.idea);  
});

router.put('/ideas/:idea/postulate', auth, function(req, res, next) {
  req.idea.postulateUser(req.payload.username, requestCallback(res, next));
});

router.put('/ideas/:idea/accept', auth, function(req, res, next) {
  req.idea.accept(req.payload.username, requestCallback(res, next));  
});

router.put('/ideas/:idea/reject', auth, function(req, res, next) {
  transitionIdeaState(req, res, next, "reject")
});

router.put('/ideas/:idea/delete', auth, function(req, res, next) {
  req.idea.delete(req.payload.username, requestCallback(res, next));
});

router.get('/activities', function(req, res, next) {
  var lastWeekDate = new Date()
  lastWeekDate.setDate(new Date().getDate()-7)

  Activity.find({
    creationDate : {
      '$gte' : lastWeekDate
    }
  }).
   sort({ creationDate: -1 }).
   exec(function(err, acts){
     if(err){ 
         console.log("error finding activities");
        return next(err);
     }
     res.json(acts);
  });

  
});



/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
