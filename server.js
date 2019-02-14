var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI ||"mongodb://localhost:27017/scraper"

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



var id = mongoose.Types.ObjectId(id);

app.get("/scrape", function(req, res){
    axios.get("https://www.nytimes.com/section/opinion?pagetype=Homepage&action=click&module=Opinion").then(function(response){
        var $ = cheerio.load(response.data);
    
        $("div.story-body").each(function(i, element) {
          var result = {};
    
          result.title = $(this).find("a").text();
          result.link = $(this).find("a").attr("href");
          result.summary = $(this).find("p.summary").text();
      
          db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
        });
        res.send("Scrape Complete");
      });
      
});

app.get("/articles", function(req, res){
    db.Article.find({})
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});


app.get("/articles/:id", function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});
  
  // Route for saving/updating an Article's associated Note


  app.post("/articles/:id", function(req, res){

    db.Note.create(req.body)
      .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle){
          res.json(dbArticle);
      })
      .catch(function(err){
        res.json(err);
      });
  });

  app.delete("/articles/:id", function(req, res) {  
    // Remove a note using the objectID
    console.log('pinfo1');
    db.Note.remove(
        {
          _id: req.params.id
        }.then(function(dbNote){
          res.json(dbNote);
      }.then(function(error, removed) {
        console.log('pinfo2');
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      })
    
    
    )
  )
});



  
    

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
