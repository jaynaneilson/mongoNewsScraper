var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  
  title: {
    type: String,
    required: true,
    unique: true
  },
 
  link: {
    type: String,
    required: true,
    unique: true
  },
 
  byLine: {
    type: String,
    required: true,
    unique: true
  },
  // Array of all the comments as a property of article schema and references comment model
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Create the Article model with the articleSchema
var Article = mongoose.model("Article", articleSchema);

// Exports the model
module.exports = Article;