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

app.get('/post', function (req, res) {
  var searchId = req.query.id;
  console.log("Searching for post " + searchId);
  var filterFunction = function (post) {
    return post.id == searchId;
  };
  var post = posts.find(filterFunction);
  console.log(post)
  res.send(post);

});

//pick and return a random element from the given list
var pickRandomFrom = function (list) {
  return list[Math.floor(Math.random()*list.length)];
};

//give the client a random post
var getRandomPost = function (request, response) {
  var randomPost = pickRandomFrom(posts);
  response.send(randomPost);
}

app.get('/random', getRandomPost);

//let a client POST something new
var saveNewPost = function (request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  console.log(request.body.image)
  console.log(request.body.author)
  console.log(request.body.date)

  var post = {};
  post.going = [];

  post.message = request.body.message;
  post.time = new Date();
  post.id = Math.round(Math.random() * 10000);
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

app.post("/attending", function (req, res) {
  var getId = parseInt(req.body.postId);
  console.log(getId);

  var filterFunction = function (post) {
      return post.id === getId;
   };
   var post = posts.find(filterFunction);
   res.send(post);
   console.log(post)


   post.going.push({name: "Alice", pic:"https://s-media-cache-ak0.pinimg.com/736x/ff/2d/57/ff2d57e8e1e8c0df80372b976aae4252.jpg"});
   post.going.push({name: "Matthew", pic:"https://s-media-cache-ak0.pinimg.com/236x/dc/cc/41/dccc41ec06bae74e666db2f1a08095d7.jpg"});
   post.going.push({name: "Andia", pic:"https://s-media-cache-ak0.pinimg.com/736x/52/3a/25/523a25ef8b034d1186fd08d5ad754072.jpg"});
   post.going.push({name: "Katie", pic:"http://www.babyanimalzoo.com/wp-content/uploads/2012/05/tiny-baby-turtle.jpg"});
   post.going.push({name: "Jess", pic:"http://goodnature.nathab.com/wp-content/uploads/2011/03/19-baby-tiger.jpg"});
   post.going.push({name: "Wynni", pic:"https://68.media.tumblr.com/2cbf6770bd952d35dba5fc853e963aed/tumblr_inline_mrl9mnxvCr1qz4rgp.jpg"});


});
