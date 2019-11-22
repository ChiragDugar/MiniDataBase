var express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/"

var app = express();
app.set('view engine','ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());


app.get("/",function(req,res){
    res.render("home", { name: "", user: "" });
});

app.get("/addstudent",function(req,res){
    res.render("addstudentpage", { message: "" })
})

app.get("/login",function(req,res){
  res.render("login", { result1: "" })
})

app.get("/signup",function(req,res){
  res.render("signup", { result: "", result1: "" })
})

app.get("/editstudent", function(req,res){
  res.render("editstudentpage", { message: "" })
})  

app.post("/signup", function(req,res){
  if(req.body.pass != req.body.confpass){
    res.render("signup", { result1: "Passwords do not match.", result: "" })
  }
  else{
  MongoClient.connect(url, function(err, db) {
      var y = 0
      if (err) throw err;
      var dbo = db.db("STUDENT_RECORDS");
      var obj = { name: req.body.name, pass: req.body.pass, confpass: req.body.confpass, email: req.body.email };
      dbo.collection("UserRecords").find({email: req.body.email}).toArray(function(err, result) {
        if (err) throw err;
        result = result[0]; 
        if(result==undefined){
          dbo.collection("UserRecords").insertOne(obj, function(err, res) {
            if (err) throw err;
            db.close();
          });
          res.render("signup", { result: "The user has been successfully created. Goto the login page.", result1: "" })    
        }

        else if(result.email == req.body.email){
          y = 1
          return res.render("signup", { result1: "The user already exists.", result: "" })
        }
        db.close();
      });
    }); 
  }
})

app.post("/login", function(req,res){
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("STUDENT_RECORDS");
      dbo.collection("UserRecords").find({email: req.body.email}).toArray(function(err, result) {
        if (err) throw err;
        result = result[0];  
        if(result==null)
          return res.send("<center><h1 style='color: red;'>The student data does not exist </h1></center>");
        if(result.pass == req.body.pass){
          res.render("home", { user: result.name })
        }
        else{
          res.render("login", { result1: "Invalid Password" })
        }
        db.close();
      });
    }); 
})

app.post("/addstudent",function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        var obj = { reg: req.body.reg, name: req.body.name, email: req.body.email, course: req.body.course, num: req.body.num };
        dbo.collection("Record").insertOne(obj, function(err, res) {
          if (err) throw err;
          db.close();
        });
        res.render("addstudentpage", { message: "Student is Successfully Added." })
      }); 
})

app.post("/editstudent", function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        var myquery = { reg: req.body.reg };
        var newvalues = { $set: {name: req.body.name ,course: req.body.course, num: req.body.num } };
        dbo.collection("Record").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
        });
        res.render("editstudentpage", { message: "Student Details Updated." });

      });
})

app.get("/deletestudent",function(req,res){
    res.render("deletestudentpage",{ message: "" });
})

app.post("/deletestudent",function(req,res){
    var x=0;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        var query = { reg: req.body.del };
        dbo.collection("Record").deleteOne(query, function(err, obj) {
          if (err) throw err;
          if(obj.deletedCount == 0)
            return res.send("<center><h1>The student data does not exist </h1></center>");
            res.render("deletestudentpage", { message: "Student Successfully Deleted" });
          db.close();
        });
      }); 
        
});

app.get("/findstudent",function(req,res){
    res.render("findstudentpage");
})

app.post("/findstudentresponse",function(req,res){
    var y = 0;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        dbo.collection("Record").find({reg: req.body.freg}).toArray(function(err, result) {
          if (err) throw err;
          result = result[0];   
          if(result==null)
            return res.send("<center><h1 style='color: red;'>The student data does not exist </h1></center>");
          res.render("studentfound", { user: result })
          db.close();
        });
      }); 
      if(y==1)
        res.send("The student data is not present");
});

app.get("/findall",function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        dbo.collection("Record").find({}).toArray(function(err, result) {
          if (err) throw err;
        //   return res.send(result)
        return res.render("allstuds",{ result: result});
          db.close();
        });
      }); 
})


app.listen(3000,function(){
    console.log("The server has started...");
});

