const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const bcrypt = require("bcrypt");

app.use(express.json());

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
            res.send("Login Successful!!");
        }else{
            throw new Error("Invalid credentials")
        }
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
