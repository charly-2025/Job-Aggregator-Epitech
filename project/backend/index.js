const express = require("express")
const app = express()


app.listen(3000,() => {
    console.log("Server is runnong on port 3000")
})


app.get("/",(req,res) =>{
    res.send("Hello from Node Api server")
})