const { selectCommentsByArticleId } = require('../models/comments.models.js');
const { selectArticleById } = require('../models/articles.models.js');

function getCommentsByArticleId(req, res, next) {
    const { article_id } = req.params;

     selectArticleById(article_id)
        .then(article => {
            if (!article) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return selectCommentsByArticleId(article_id);
        })
        .then(comments => {
            res.status(200).send({ comments });
        })
        .catch(next);
}

module.exports = { getCommentsByArticleId };
