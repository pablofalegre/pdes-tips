var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },,
  description: String,
  creationDate: { type: Date, default: Date.now },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  state: String
});

mongoose.model('Idea', IdeaSchema);