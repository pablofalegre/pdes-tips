var mongoose = require('mongoose');
var Activity = mongoose.model('Activity');
var activitiesConf = require('../config/ActivitiesConfig');


//Middleware para creacion de eventos.
var activityLog = function(req, res, next) {

  res.on('finish', function(){

    //despues se podria hacer algo para que un middeware deje un usuario siempre (un Anonimo si no estan logeados), y evitamos preguntar.
    if(res.statusCode == 200 && req.user){
      
      //TODO si no se configura el router como corresponde esto no vaa funcionar: el req.route.path va a contener el baseUrl
      var fixedPath = req.route.path;

      if(fixedPath == "/"){
        fixedPath = "";
      }

      var activityOpt = activitiesConf.find(req.baseUrl + fixedPath, req.method);

      activityOpt.map(function(activity){
        
        activity(req.user, req, res).save(function(err, activity){
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