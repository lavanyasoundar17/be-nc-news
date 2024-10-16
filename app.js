const express = require("express");
const { getTopics } = require('./controllers/topics.controllers.js');
const {getArticlesById,getArticles,patchArticleVotes} = require("./controllers/articles.controllers.js");
const endpoints = require("./endpoints.json");
const { getCommentsByArticleId,postCommentByArticleId } = require('./controllers/comments.controllers.js');

const app = express();

app.use(express.json());

app.get("/api/topics",getTopics)
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id",patchArticleVotes)



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