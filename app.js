const express = require("express");
const { getTopics } = require('./controllers/topics.controllers.js');
const {getArticlesById,getArticles,patchArticleVotes} = require("./controllers/articles.controllers.js");
const endpoints = require("./endpoints.json");
const { getCommentsByArticleId,postCommentByArticleId,deleteComments } = require('./controllers/comments.controllers.js');
const {getUsers} = require('./controllers/users.controllers.js');

const app = express();

app.use(express.json());

app.get("/api/topics",getTopics)
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id",patchArticleVotes);
app.delete("/api/comments/:comment_id",deleteComments);

app.get("/api/users",getUsers);

app.get("/api", (req, res) => {
    res.status(200).send({ endpoints });
  });

  app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
});


app.use((error,req,res,next)=>{
    if (error.code === '22P02') { 
        res.status(400).send({ msg: 'Bad request: invalid input' });
    }
    if(error.status){
        res.status(error.status).send({msg: error.msg})
    }
    else{
        next(error)
    }
})

app.use((error,req,res,next)=>{
    res.status(500).send({msg: 'Internal server error'})
})




module.exports=app;