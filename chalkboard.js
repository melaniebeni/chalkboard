const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
// const router = express.Router();
const path = require('path');
var bodyParser=require("body-parser");
const mongoose = require('mongoose');
var url= "mongodb+srv://beme6718:beme6718@cluster0.cqeub.mongodb.net/test?retryWrites=true&w=majority";
 
mongoose.connect(url);
var db = mongoose.connection;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views','public/html.html/');


app.post("/signup", function (req, res, next) {
     
    var firstname= req.body.firstname;
    var lastname= req.body.lastname; 
    var email= req.body.email;
    var id= req.body.id;
    var pwd= req.body.pwd;
    var repeat= req.body.psw-repeat;

    var user = {
      "firstname": firstname,
      "lastname": lastname, 
      "id": id,
      "email": email,
      "pwd": pwd,
      "repeat": repeat
    };
    db.collection("Users").insertOne(user, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    });
  
})

app.post("/create", function (req, res, next) {    
    var coursename= req.body.cname;
    var description= req.body.description; 
    var instructor= req.body.Instructor;
    var materials= req.body.materials;
    var background= req.body.img;
    var lesson=req.body.Lesson;
    var q1=req.body.q1;

    var course = {
      "coursename": coursename,
      "description": description,"instructor": instructor,
      "materials": materials,
      "background": background,
      "lesson": lesson,
      "Q1": q1
    };
    db.collection("Courses").insertOne(course, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    });
  
  //res.send(Login.html);
})
app.get("/admin", function (req, res) {   
db.collection("Courses").find({} , function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
      console.log("1 document inserted");
      res.send(allDetails.forEach(doc =>  print( doc.quality_level ) )); // checking contents of response
      //res.render("AdminView1.ejs", { user: allDetails })
    }
}).toArray();
    });
app.get('/login', function(req,res){
   db.collection("devices").find( { $text: { $search: "@student.com" } } )
, function(err, data) {
      if(err) {
         res.send(err.message);
      }
      else{
        
        res.send(data);
      }}
});

// app.use(require("express").static(__dirname + "/html.html"));
// app.use(require("express").static(__dirname + "/CSS"));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/indexcss', function(req, res){
  res.sendFile(path.join(__dirname, 'index.css'));
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

// app.use('/', router);



