const {selectArticleById} = require("../models/articles.models.js")

function getArticles (req,res,next){
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

module.exports={getArticles};