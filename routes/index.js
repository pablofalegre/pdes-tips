var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Idea = mongoose.model('Idea');
var User = mongoose.model('User');

router.get('/ideas', function(req, res, next) {
  Idea.find({ 'state': {'$ne': 'eliminada'} }, function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
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

router.get('/ideas/:idea', function(req, res) {  
    req.idea.populate('postulant', function(err, idea) {
      if (err) { return next(err); }
      res.json(idea);
    });
  });

router.put('/ideas/:idea/postulate', auth, function(req, res, next) {
  idea = Idea.find(req.idea);
  idea.postulant = req.payload.username;
  req.idea.postulateUser(req.payload.username, function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  });
});

router.put('/ideas/:idea/accept', auth, function(req, res, next) {
  idea = Idea.find(req.idea);
  req.idea.accept(req.payload.username, function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  });  
});

router.put('/ideas/:idea/reject', auth, function(req, res, next) {
  idea = Idea.find(req.idea);
  req.idea.reject(req.payload.username, function(err, idea){
    if (err) { return next(err); }
    res.json(idea);
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
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
