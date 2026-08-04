const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");


const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

app.use(express.json());
// Use the cookie-parser middleware
app.use(cookieParser());

app.post("/signup",async (req,res)=>{

    try{
    //validation of data.
        validateSignUpData(req);

//encrypt the user password.
const{firstName,lastName,emailId,password}=req.body;

const passwordHash = await bcrypt.hash(password,10);
//creating a new instance of the User Model.
    const user = new User({firstName,lastName,emailId,password:passwordHash});
 

       await user.save();
   res.send("User added successfully!!!");
}
catch(err){
    res.status(400).send("Error saving the user:"+err.message);
}


})

app.post("/login",async(req,res)=>{

    try{
        const{emailId,password}=req.body;
        const user = await User.findOne({emailId:emailId});

        if(!user){
            
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(isPasswordValid){

            const token = await jwt.sign({_id:user.id},"DEVTinder@123")

            res.cookie("token",token);

            res.send("Login Successful!!");
        }else{
            throw new Error("Invalid credentials")
        }
    }
    catch(err){
    res.status(400).send("Error saving the user:"+err.message);
}

})
 app.get("/profile",async(req,res)=>{
    try{
        
    const cookies = req.cookies;
    const {token} = cookies;

    if(!token){
        throw new Error("Invalid TOken");
    }
    //validate the token:
    const decodedMessage = await jwt.verify(token,"DEVTinder@123");
    console.log(decodedMessage);

    const{_id} = decodedMessage;

    console.log("Loggedin user is:"+_id);

    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not Found!!")
    }

    console.log(cookies);
    res.send(user);
    }   
    
    
    catch(err){
        res.status(400).send("Error saving the user:"+err.message);
    }

 })

connectDB().then(()=>{
    console.log("Database Connected Successfully!!!");

    app.listen(7777,()=>{
        console.log("Server Running successfully on 7777!!!!")
    })

})
.catch((err)=>{
    console.error("Database cannot be connected!!");
})
