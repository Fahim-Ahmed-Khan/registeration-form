const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;




// Connect to MongoDB
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.lei6amk.mongodb.net/?retryWrites=true&w=majority` , {
    useNewUrlParser :true,
    useUnifiedTopology : true,
});


// Define schema and model for user
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve static files from the project directory
app.use(express.static(__dirname));





// Route for serving index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

// Route for handling registration
app.post("/register", async (req, res) => {
    try{
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({email : email});
    if(!existingUser){
   // Create a new user
   const registrationData = new Registration({
    name,
    email,
    password
});
await registrationData.save();
res.redirect("/success");

    }
    else{
        console.log("User already Exists");
        res.redirect("/error");
    }
   
}

   catch(error) {
             console.log(error)
          res.redirect("error")
   }
    // Save the user to the database
});

app.get("/success", (req, res)=>{
    res.sendFile(__dirname+"/pages/success.html")
});

app.get("/error", (req, res)=>{
    res.sendFile(__dirname+"/pages/error.html")
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
