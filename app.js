const express= require("express");
const app = express();
const mongoose= require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Question = require('./models/questionPaper.js');
const User = require('./models/users.js');
const router=express.Router();




app.set("view engine","ejs");
app.engine("ejs",ejsMate) //for ejsMate working;
app.set("views",path.join(__dirname,"views")); //for connecting different folder -> ex: views 
app.use(express.urlencoded({extended:true})); //for parsing parameters in requests;
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));  //to serve all js or css files to ejs 



const MONGO_URL="mongodb://127.0.0.1:27017/TestMaker";

main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);56
});

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.listen(8080,()=>{
    console.log("Server is Listening to port 8080");
});

//FrontPage Route
app.get("/testCreator",(req,res)=>{
   res.render("FrontOptions/FrontPage.ejs");
});

//CreateTest Route
app.get("/testCreator/CreateTest",(req,res)=>{
    res.render("FrontOptions/CreateTest.ejs");
});

//Login route
app.get("/testCreator/login",(req,res)=>{
    res.render("FrontOptions/login.ejs");
});

//Signup Route
app.get("/testCreator/signup",(req,res)=>{
    res.render("FrontOptions/Signup.ejs");
});

app.post('/testCreator', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password:hashedPassword
        });
        await user.save();
        res.send('<div class="alert alert-success" role="alert">Signup successful! Redirecting...</div><script>window.setTimeout(function() { window.location.href = "/testCreator"; }, 2000);</script>');
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Error signing up user');
    }
});

app.post('/testCreators', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.send('<div class="alert alert-success" role="alert">Login successful! Redirecting...</div><script>window.setTimeout(function() { window.location.href = "/testCreator"; }, 1000);</script>');
        } else {
            res.status(401).send('Incorrect password');
        }
    } else {
        res.status(404).send('User not found');
    }
});

// Route to handle form submission with image upload
app.post('/submitQuestion',  async (req, res) => {
    try {
        const { questionNumber, subject,  description, image, correctAns } = req.body;

        // Create a new question instance
        const newQuestion = new Question({
            questionNumber,
            subject,
            description,
            image,
            correctAns
        });

        // Save the new question to the database
        await newQuestion.save();

        res.send('<div class="alert alert-success" role="alert"> Question Added!  Redirecting...</div><script>window.setTimeout(function() { window.location.href = "/testCreator/CreateTest"; }, 1000);</script>');
    } catch (error) {
        console.error('Error saving question:', error);
        res.status(500).send('Error saving question');
    }
});

app.get("/testCreator/Attempt", async (req,res)=>{
    let questions= await Question.find();
    res.render("Attempt/Attempt.ejs",{questions});
});
















 

