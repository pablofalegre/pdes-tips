var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');
var activitiesConf = require('../models/ActivitiesConfig');


//Middleware para creacion de eventos.
var activityLog = function(req, res, next) {

  res.on('finish', function(){

    //despues se podria hacer algo para que un middeware deje un usuario siempre (un Anonimo si no estan logeados), y evitamos preguntar.
    if(res.statusCode == 200 && req.payload){
      
      var activityOpt = activitiesConf.find(req.route.path, req.method);

      activityOpt.map(function(activity){
        
        activity(req.payload.username, req, res).save(function(err, activity){
          if(err){
            console.log('error saving ' + err);
            return next(err); 
          }
          console.log("saved activity = " + activity);
        });
        
      });
    }   
  });  
  next();
};

module.exports = activityLog;