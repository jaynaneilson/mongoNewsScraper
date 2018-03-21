// Scrapers
var request = require("request");
var cheerio = require("cheerio");
// Models
var Comment = require("../models/Note.js");
var Article = require("../models/Headline.js");

module.exports = function (app) {

  app
    .get('/', function (req, res) {
      res.redirect('/articles');
    });

  app.get("/scrape", function (req, res) {
    //use request dependecy to grab the body of the html
    request("https://www.theverge.com//", function (error, response, html) {
      var $ = cheerio.load(html);
      // Now grab every a tag link within an article heading and iterate through
      $("div.c-entry-box--compact__body").each(function (i, element) {

        var title = $(this)
          .children("h2.c-entry-box--compact__title")
          .children("a")
          .text();
        var link = $(this)
          .children("h2.h2.c-entry-box--compact__title")
          .children("a")
          .attr("href");
        var byLine = $(this)
          .children("div.c-byline")
          .children("a")
          .text();

        if (title && link && byLine) {
          // Save an empty result object
          var result = {};

          // Add the text and href of every link, and save them as properties of the
          // result object
          result.title = title;
          result.link = link;
          result.byLine = byLine;

          // Create new entry using Article model
          db.Article.create(result, function (err, doc) {
            if (err) {
              console.log(err
              );
            } else {
              console.log(doc);
            }
          });
        }
      });
    });

    res.redirect("/");
  });

  // This will get the articles we scraped from the mongoDB
  app.get("/articles", function (req, res) {
   
   db.Article.find({}, function (error, doc) {
       
        if (error) {
          console.log(error
          );
        } else {
          res.render("index", {result: doc});
        }
        //Will sort the articles by most recent (-1 = descending order)
      })
      .sort({'_id': -1});
  });


  app.get("/articles/:id", function (req, res) {

    db.Article.findOne({"_id": req.params.id})

      .populate("comment")
      .exec(function (error, doc) {
       
        if (error) {
          console.log(error
          );
        } else {
          res.render("comments", {result: doc});
       
        }
      });
  });

 
  app.post("/articles/:id", function (req, res) {
    // Create a new Comment and pass the req.body to the entry
    db.Comment.create(req.body, function (error, doc) {

        if (error) {
          console.log(error
          );
        } else {
         
          db.Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "comment": doc._id
            }
          }, {
            safe: true,
            upsert: true,
            new: true
          })
       
            .exec(function (err, doc) {
            
              if (err) {
                console.log(err);
              } else {
                
                res.redirect('back');
              }
            });
        }
      });
  });

  app.delete("/articles/:id/:commentid", function (req, res) {
    db.Comment.findByIdAndRemove(req.params.commentid, function (error, doc) {
        
        if (error) {
          console.log(error
          );
        } else {
          console.log(doc);
          db.Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $pull: {
              "comment": doc._id
            }
          })
          
            .exec(function (err, doc) {
              
              if (err) {
                console.log(err);
              }
            });
        }
      });
  });

};