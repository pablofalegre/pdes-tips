var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  creationDate: { type: Date, default: Date.now },
  postulant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  state: String
});

IdeaSchema.methods.postulateUser = function(user_id, callback){
	this.postulant = user_id;
	this.state = 'en revision'
	this.save(callback);
};

mongoose.model('Idea', IdeaSchema);