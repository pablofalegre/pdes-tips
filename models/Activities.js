var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
  user: String,
  action: String,
  target: String
});

ActivitySchema.methods.print = function() {
  return this.user.username + " " + this.action + " " + target;
};

mongoose.model('Activity', ActivitySchema);
