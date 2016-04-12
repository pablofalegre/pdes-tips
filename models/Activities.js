var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  target: String
});

ActivitySchema.methods.print = function() {
  return this.user.username + " " + this.action + " " + target;
};


mongoose.model('Activity', ActivitySchema);