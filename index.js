//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var database = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
var posts = [];

//let a client GET the list
var sendPostsList = function (request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
var saveNewPost = function (request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  console.log(request.body.image)
  console.log(request.body.author)
  console.log(request.body.date)

  var post= {};
  post.message = request.body.message;
  post.time = new Date();

  if (request.body.image === "") {
    post.image = "http://www.abc.net.au/triplej/emoji/img/emojis/17.png";
  } else {
    post.image = request.body.image
  }
  post.author = request.body.author;
  post.date = request.body.date;
  posts.push(post);
  response.send("thanks for your message. Press back to add another");
  var dbPosts = database.collection('posts');
  dbPosts.insert(post);
}
app.post('/posts', saveNewPost);


//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");

var mongodb = require('mongodb');
var uri = 'mongodb://girlcode2016:girlsrule@ds149567.mlab.com:49567/keep-posts-when-server-restarts2016';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
