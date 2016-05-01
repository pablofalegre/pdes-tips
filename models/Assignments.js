var mongoose = require('mongoose');

var AssignmentSchema = new mongoose.Schema({
  name: String
});

mongoose.model('Assignment', AssignmentSchema);