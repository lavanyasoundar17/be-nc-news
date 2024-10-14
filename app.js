const express = require("express");
const { getTopics } = require('./controllers/topics.controllers.js');
const app = express();

app.get("/api/topics",getTopics)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
});

app.use((error,req,res,next)=>{
    console.log(error)
    res.status(500).send({msg: 'Internal server error'})
})


module.exports=app;