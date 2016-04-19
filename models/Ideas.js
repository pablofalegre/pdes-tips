var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  creationDate: { type: Date, default: Date.now },
  postulant: String,
  state: String
});

IdeaSchema.methods.postulateUser = function(user_id, callback){
	this.postulant = user_id;
	this.state = 'en revision';
	this.save(callback);
};

IdeaSchema.methods.accept = function(user_id, callback){
	this.state = 'aceptada';
	this.save(callback);
};

IdeaSchema.methods.reject = function(user_id, callback){
	this.state = 'disponible';
	this.postulant = undefined;
	this.save(callback);
};

mongoose.model('Idea', IdeaSchema);