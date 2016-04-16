var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  creationDate: { type: Date, default: Date.now },
  postulant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  state: String
});

mongoose.model('Idea', IdeaSchema)