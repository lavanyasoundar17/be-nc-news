const { selectCommentsByArticleId,insertCommentByArticleId } = require('../models/comments.models.js');
const { selectArticleById } = require('../models/articles.models.js');

function getCommentsByArticleId(req, res, next) {
    const { article_id } = req.params;

     selectArticleById(article_id)
        .then(() => {
            return selectCommentsByArticleId(article_id);
        })
        .then(comments => {
            res.status(200).send({ comments });
        })
        .catch(next);
}

//task 7
function postCommentByArticleId(req,res,next){
    const {article_id} = req.params;
    const {username,body} = req.body;
    selectArticleById(article_id)
    .then(()=>{
        return insertCommentByArticleId(article_id,username,body)
    })
    .then(comment => {
        res.status(201).send({ comment });
    })
    .catch(next);
}

module.exports = { getCommentsByArticleId,postCommentByArticleId };
