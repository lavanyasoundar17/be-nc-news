const { selectCommentsByArticleId,insertCommentByArticleId,selectCommentsByCommentsId} = require('../models/comments.models.js');
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

//task 9
function deleteComments(req,res,next){
    const {comment_id}=req.params;
    selectCommentsByCommentsId(comment_id)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        //console.log("Error in controller",err);
        next(err);
    });

}

module.exports = { getCommentsByArticleId,postCommentByArticleId,deleteComments };
