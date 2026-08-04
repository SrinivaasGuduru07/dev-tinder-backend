const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const {userAuth} = require("./Middlwares/auth")

const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

app.use(express.json());
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
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)

        if(isPasswordValid){
            const token = await user.getJWT();

            res.cookie("token",token,{
                expires: new Date(Date.now()+8*3600000)
            });
            res.send("Login Successful!!");
        }else{
            throw new Error("Invalid credentials")
        }
    }
    catch(err){
    res.status(400).send("Error saving the user:"+err.message);
}

})


app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }   
    catch(err){
        res.status(400).send("Error saving the user:"+err.message);
    }
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user = req.user;
    res.send(user.firstName +" sent the connection request")
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



