var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
  user: String,
  action: String,
  target: String,
  creationDate: { type: Date, default: Date.now }
});

ActivitySchema.methods.print = function() {
  return this.user.username + " " + this.action + " " + target;
};

mongoose.model('Activity', ActivitySchema);
