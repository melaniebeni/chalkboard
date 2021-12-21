const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
var bodyParser=require("body-parser");
const mongoose = require('mongoose');
//const redisStore = require('connect-redis')(session);
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var customId = require("custom-id");

const router = express.Router();
passport = require("passport");

   app.use(morgan("dev"));
   
    LocalStrategy = require("passport-local").Strategy;
    passportLocalMongoose =
        require("passport-local-mongoose");
    User = require("./model/user");
 
var routes = require('./model/user')(passport);
app.use(cookieParser());
module.exports=router;

var url= "mongodb+srv://beme6718:beme6718@cluster0.cqeub.mongodb.net/test?retryWrites=true&w=majority";
 
mongoose.connect(url);
var db = mongoose.connection;
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useUnifiedTopology: true});

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/");
  } else {
    next();
  }
};
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
    //cookie: {
     // expires: 600000,
   // },
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
    var id= customId({});
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
    //console.log("1 document inserted");
    res.redirect("/")
    });
    }
    else{
      db.collection("Students").insertOne(user, function(err, collection) {
    if (err) throw err;
    //console.log("1 document inserted");
    res.redirect("/")
    });
   }
})
app.post("/create", function (req, res, next) {    
    var coursename= req.body.cname;
    var description= req.body.description; 
    var instructor= req.body.Instructor;
    var materials= req.body.materials;
    var background= req.body.img;

    var course = {
    
      "coursename": coursename,
      "description": description,
      "instructor": instructor,
      "materials": materials,
      "background": background,
      
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

app.post('/croster', function(req, res){
    var id =req.body.id;
    var coursename= req.body.search;
    var status="pending";
    //accepted or denyed only accepted will be able to view
    var student = {
      "id":id,
      "coursename":coursename,
      "status": status
    };
    db.collection("roster").insertOne(student, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    }); 
});
app.get('/roster', function(req, res){
  db.collection("roster").find({}).toArray(function(err, r) {
    if (err) throw err;
    
   res.render("RosterView.ejs", {student:r})
  
    })
});
app.post('/cassignment', function(req, res){
    var coursename= req.body.cname;
    var lesson = req.body.Lesson;
    var q1 = req.body.q1;
    var q2 = req.body.q2;
    var q3 = req.body.q3;
    var q4 = req.body.q4;
    var q5 = req.body.q5;

    var lesson = {
      "coursename":coursename,
      "lesson": lesson,
      "q1": q1,
      "q2": q2,
      "q3": q3,
      "q4": q4,
      "q5": q5
    };
    db.collection("lesson").insertOne(lesson, function(err, collection) {
    if (err) throw err;
    console.log("1 document inserted");
    res.redirect("InstructorCourseView.html")
    }); 
});
app.get('/sav', function(req, res){
   var coursename= req.body.cname;
  db.collection("lesson").findOne({coursename: coursename}, (function(err, r) {
    if (err) throw err;
    
   res.render("StudentAssignView.ejs", {student:r})
  
    })
)
});
app.get("/search", function (req, res) {
    var search=req.body.search;
db.collection("Students").findOne({search} , function (err, resu) {
    if (err) throw err;
    //res.render("AdminView1.ejs", { user: resu })
});
});

app.post('/login', function (req, res) {
    sessionData = req.session;
    sessionData.user = {};
    
    var e= req.body.email;
    var passwd= req.body.pwd; 
    sessionData.user.email = e;
    sessionData.user.pwd = passwd;
   db.collection("Students").findOne({email:e},{pwd: passwd},function (err, r) {
    if (err) throw err;
    if(r){
    res.render("StudentView1.ejs", { user: r })
    }
});
db.collection("Instructors").findOne({email:e},{pwd: passwd},function (err, re) {
    if (err) throw err;
    db.collection("Courses").find({}).toArray(function(err, r) {
    if (err) throw err;
    if(r){
    res.render("InstructorView1.ejs", { user:re, course:r})
    }
    else{
      res.render("/login")
    }
});
  
});
    db.collection("Admin").findOne({email:e},{pwd: passwd},function (err, r) {
    if (err) throw err;
    if(r){
    res.redirect("/admin")
    }
   
});
   
});

app.get('/delete', function(req, res){
  var del= req.body.delete;
  db.collection("roster").remove({id: del} ,function (err, r) {
    if (err) throw err;
    if(r){
    //
    }
     });
});
app.get('/test', function(req, res){
  res.render("StudentView1.ejs")
});

app.get('/', function(req, res){
  sess = req.session;
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/indexcss', function(req, res){
  res.sendFile(path.join(__dirname, 'index.css'));
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

app.use('/', router);

