var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Post = mongoose.model('Post');
var Activity = mongoose.model('Activity');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Idea = mongoose.model('Idea');

router.get('/pending_ideas', function(req, res, next) {
  Idea.find({ 'state': 'en revision' }, function(err, pending_ideas){
    if(err){ return next(err); }

    res.json(pending_ideas);
  });
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
