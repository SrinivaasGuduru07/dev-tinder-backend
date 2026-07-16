const express = require("express");

const app = express();

app.use("/hello",(req,res)=>{
    res.send("hello from the server!!!")
})

app.use("/test",(req,res)=>{
    res.send("test from the server!!!")
})

app.listen(3000,()=>{
    console.log("Server running on 3000!!!!");
});