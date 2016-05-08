var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');

router.get('/', function(req, res, next) {
  var lastWeekDate = new Date()
  lastWeekDate.setDate(new Date().getDate()-7)

  Activity.find({
    creationDate : {
      '$gte' : lastWeekDate
    }
  }).
   populate('user').
   sort({ creationDate: -1 }).
   exec(function(err, acts){
     if(err){ 
         console.log("error finding activities");
        return next(err);
     }
     res.json(acts);
  });

  
});

module.exports = router;

