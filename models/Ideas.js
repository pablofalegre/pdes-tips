var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  description: String,
  creationDate: { type: Date, default: Date.now },
  postulant: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  state: String,
  assignments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'}]
});

IdeaSchema.methods.postulateUser = function(user, callback){
	this.postulant = user;
	this.state = 'en revision';
	this.save(callback);
};

IdeaSchema.methods.accept = function(user, callback){
	this.state = 'aceptada';
	this.save(callback);
};

IdeaSchema.methods.reject = function(user, callback){
	this.state = 'disponible';
	this.postulant = undefined;
	this.save(callback);
};

IdeaSchema.methods.delete = function(user, callback){
	this.state = 'eliminada';
	this.save(callback);
};

module.exports = mongoose.model('Idea', IdeaSchema);

