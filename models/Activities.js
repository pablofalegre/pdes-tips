var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  action: String,
  target: String,
  creationDate: { type: Date, default: Date.now }
});

//no esta funcionando porque en la view llama al json y no a Activity
ActivitySchema.methods.print = function(act) {
  return this.user+ " " + this.action + " " + this.target;
};

mongoose.model('Activity', ActivitySchema);
