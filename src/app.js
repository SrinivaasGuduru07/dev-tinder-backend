const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup",async (req,res)=>{
//creating a new instance of the User Model.
    const user = new User(req.body);
 
try{
       await user.save();
   res.send("User added successfully!!!");
}
catch(err){
    res.status(400).send("Error saving the user:"+err.message);
}


})

//get one user from the database:
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId:userEmail});
        if(users.length === 0){
            res.status(404).send("User not Found");
        }else{
            res.send(users)
        }
    }
    catch(err){
    console.error("Something went Wrong!!!");
}
})
//Get all the users form the database:
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong!!")
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
