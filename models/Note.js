var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

  name: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  }
});

// Create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Exports the Comment model
module.exports = Comment;