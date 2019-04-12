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
    res.render("home");
});

app.get("/addstudent",function(req,res){
    res.render("addstudentpage")
})


app.post("/addstudentresponse",function(req,res){
    console.log("ENTERED ADD STUDENT ROUTE")
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        var obj = { reg: req.body.reg, name: req.body.name, email: req.body.email, course: req.body.course, num: req.body.num };
        dbo.collection("Record").insertOne(obj, function(err, res) {
            console.log(res)
          if (err) throw err;
          db.close();
        });
        res.render("studentadded");
      }); 
})

app.get("/deletestudent",function(req,res){
    res.render("deletestudentpage");
})

app.post("/deletestudentresponse",function(req,res){
    var x=0;
    console.log("ENTERED DELETE STUDENT ROUTE");
    console.log(req.body);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        var query = { reg: req.body.del };
        dbo.collection("Record").deleteOne(query, function(err, obj) {
          if (err) throw err;
          if(obj.deletedCount == 0)
            return res.send("<center><h1>The student data does not exist </h1></center>");
            res.render("studentdeleted");
          db.close();
        });
      }); 
        
});

app.get("/findstudent",function(req,res){
    console.log("ENTERED FIND STUDENT ROUTE");
    res.render("findstudentpage");
})

app.post("/findstudentresponse",function(req,res){
    var y = 0;
    console.log("ENTERED THE FIND STUDENT ROUTE");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        dbo.collection("Record").find({reg: req.body.freg}).toArray(function(err, result) {
          if (err) throw err;
          result = result[0];   
          console.log(result);
          if(result==null)
            return res.send("<center><h1 style='color: red;'>The student data does not exist </h1></center>");
          res.render("studentfound",{name: result.name, reg: result.reg, email: result.email, course: result.course, num: result.num })
          console.log(result);
          db.close();
        });
      }); 
      if(y==1)
        res.send("The student data is not present");
});

app.post("/findall",function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("STUDENT_RECORDS");
        dbo.collection("Record").find({}).toArray(function(err, result) {
          if (err) throw err;
        //   return res.send(result)

        return res.render("allstuds",{name: result.name, reg: result.reg, email: result.reg, num: result.num, course: result.couse, result: result});
          db.close();
        });
      }); 
})


app.listen(3000,function(){
    console.log("The server has started.");
});

