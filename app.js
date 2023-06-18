//jshint esversion:6
require("dotenv").config();
const express =require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const  mongoose =require("mongoose");
const encrypt=require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://127.0.0.1:27017";
mongoose.connect(uri+"/userDB");

const userSchema =new mongoose.Schema({
    email:String,
    password:String
});
const secret=process.env.SECRET
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]})
const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    console.log("User",newUser)
    newUser.save().then(()=>{
        res.render("secrets")
    }).catch((err)=>{
        console.log(err);
    })
    
})

app.post("/login",(req,res)=>{
    const userName =req.body.username;
    const password=req.body.password;

    User.findOne({email:userName}).then((foundUser)=>{
        if(foundUser.password===password){
            res.render("secrets")
        }else{
            console.log("Wrong Password")
        }
       
    }).catch((err)=>{
        console.log(err);
    })
    
})


app.listen(3000,function(){
    console.log("Listening to port 3000");
})