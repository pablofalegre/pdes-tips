var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var findUser = require('./findUser');
var roles = require('../models/Roles');

//chequea que el usuario tenga al menos uno de los roles necesarios
var rolAuth = function(rolesRequired){

  return function(req, res, next) {
    if(roles.hasOneRole(req.user, rolesRequired)){
      next();
    } else {
      res.status(401).json({error: 'Esta accion es para ' + rolesRequired});
    }
  }
}

var fullAuth = function(rolRequired){
	return [auth, findUser, rolAuth(rolRequired)];
};

module.exports = fullAuth;
