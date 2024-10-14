const {selectArticleById, selectArticle} = require("../models/articles.models.js")

function getArticlesById (req,res,next){
    const {article_id} = req.params;
    
    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Bad request' });
      }

return selectArticleById(article_id)
.then(article => {
    if (!article) {
        return res.status(404).send({ msg: 'Article not found' });
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
            return res.status(404).send({msg: "articles not found"})
        }
        res.status(200).send({ articles });
    })
    .catch(next);
}


module.exports={getArticlesById,getArticles};