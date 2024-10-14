const express = require("express");
const { getTopics } = require('./controllers/topics.controllers.js');
const {getArticles} = require("./controllers/articles.controllers.js")
const endpoints = require("./endpoints.json");

const app = express();


app.get("/api/topics",getTopics)
app.get("/api/articles/:article_id", getArticles);



app.get("/api", (req, res) => {
    res.status(200).send({ endpoints });
  });

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
});


app.use((error,req,res,next)=>{
    if(error.status){
        res.status(error.status).send({msg: error.msg})
    }
    else{
        next(error)
    }
})

app.use((error,req,res,next)=>{
    console.log(error)
    res.status(500).send({msg: 'Internal server error'})
})


module.exports=app;