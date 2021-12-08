const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
var bodyParser=require("body-parser");
const mongoose = require('mongoose');

const router = express.Router();
passport = require("passport");

    LocalStrategy = require("passport-local").Strategy;
    passportLocalMongoose =
        require("passport-local-mongoose");
    User = require("./model/user");
 
var routes = require('./model/user')(passport);

module.exports=router;

var url= "mongodb+srv://beme6718:beme6718@cluster0.cqeub.mongodb.net/test?retryWrites=true&w=majority";
 
mongoose.connect(url);
var db = mongoose.connection;
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useUnifiedTopology: true});
 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views','public/html.html/');


app.post("/signup", function (req, res, next) {
    var instructor=req.body.instructor;
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
    if (instructor=="instructor"){
    db.collection("Instructors").insertOne(user, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    });
    }
    else{
      db.collection("Students").insertOne(user, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    });
    }
  
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
      "description": description,
      "instructor": instructor,
      "materials": materials,
      "background": background,
      "lesson": lesson,
      "Q1": q1
    };
    db.collection("Courses").insertOne(course, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    });
    
})

app.get("/admin", function (req, res, ) {   
  db.collection("Students").find({}).toArray(function(err, result) {
    if (err) throw err;
    //res.render("AdminView1.ejs", { student: result })
    
    db.collection("Instructors").find({}).toArray(function(err, results) {
    if (err) throw err;
    db.collection("Courses").find({}).toArray(function(err, r) {
    if (err) throw err;
   res.render("AdminView1.ejs", { i: results, student:result, course:r})
    })
   //res.render("AdminView1.ejs", { i: results, student:result})
    })
    }) 
});

app.get("/course", function (req, res, ) {   
  db.collection("Courses").find({}).toArray(function(err, result) {
    if (err) throw err;
    //res.send(result);
    //console.log(result);
    //res.render("StudentView1.ejs", { course: result })
    }) 
    
});

app.post("/login", function (req, res) {
    var e= req.body.email;
    var passwd= req.body.pwd; 
db.collection("Students").findOne({email:e},{pwd: passwd},function (err, r) {
    if (err) throw err;
    if(r){
    res.render("StudentView1.ejs", { user: r })
    }
});
db.collection("Instructors").findOne({email:e},{pwd: passwd},function (err, r) {
    if (err) throw err;
    if(r){
    res.render("InstructorView1.ejs", { user: r })
    }
   
});
    db.collection("Admin").findOne({email:e},{pwd: passwd},function (err, r) {
    if (err) throw err;
    if(r){
    res.redirect("/admin")
    }
   
});
 });



app.get("/search", function (req, res) {
    var search=req.body.search;
db.collection("Students").findOne({search} , function (err, resu) {
    if (err) throw err;
    res.render("AdminView1.ejs", { user: resu })
});
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/indexcss', function(req, res){
  res.sendFile(path.join(__dirname, 'index.css'));
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

app.use('/', router);

