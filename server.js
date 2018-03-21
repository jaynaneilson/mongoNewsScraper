// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds121089.mlab.com:21089/heroku_xqbms355";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Initialize express app
var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));

// Create and set handlebars engine
app.engine("handlebars", exphbs({
  defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Console database connection
var db = mongoose.connection;

// if any errors than console errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// display a console message when mongoose has a conn to the db
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Require the routes in controllers file
require("./controllers/fetch.js")(app);

//Listen on PORT 8080
app.listen(PORT, function () {
  console.log("Site is live, yay!");
});