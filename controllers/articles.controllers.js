const {selectArticleById, selectArticle} = require("../models/articles.models.js")

function getArticlesById (req,res,next){
    const {article_id} = req.params;

 selectArticleById(article_id)
.then(article => {
    if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
    }
    res.status(200).send({ article });
})
.catch(next);
}


//task5 

function getArticles(req,res,next){
    return selectArticle()
    .then((articles)=>{
        if(!articles){
            return Promise.reject({ status: 404, msg: "Article not found" });
        }
        res.status(200).send({ articles });
    })
    .catch(next);
}


module.exports={getArticlesById,getArticles};