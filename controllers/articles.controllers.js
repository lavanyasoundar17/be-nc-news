const {selectArticleById, selectArticle,updateArticleVotes} = require("../models/articles.models.js")

function getArticlesById (req,res,next){
    const {article_id} = req.params;

 selectArticleById(article_id)
.then(article => {
    res.status(200).send({ article });
})
.catch(next);
}


//task5 & task11

function getArticles(req,res,next){
    
    const {sort_by,order}=req.query;

    const validQueries = ['sort_by', 'order'];
    const receivedQueries = Object.keys(req.query);

    // Check for unsupported query parameters
    const invalidQueries = receivedQueries.filter(query => !validQueries.includes(query));

    if (invalidQueries.length > 0) {
        return res.status(400).send({ msg: 'Bad request: invalid query parameter' });
    }
    
    return selectArticle(sort_by, order)
    .then((articles)=>{
        res.status(200).send({ articles });
    })
    .catch(next);
}


//task7
function patchArticleVotes(req, res, next) {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    
    if (typeof inc_votes !== 'number') { 
        return res.status(400).send({ msg: 'Bad request: missing required fields' });
    }
    
    updateArticleVotes(article_id, inc_votes)
    
        .then(updatedArticle => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
}


module.exports={getArticlesById,getArticles,patchArticleVotes};