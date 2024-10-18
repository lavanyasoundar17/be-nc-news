const db = require('../db/connection');

function selectArticleById(article_id){

    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      }
      
    return db.query('SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;', [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0]; 
        });
}

//task 5 & task 11
function selectArticle(){
    
    const query = `
        SELECT articles.article_id, articles.title, articles.author, articles.topic, 
               articles.created_at, articles.votes, articles.article_img_url,
               COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `;
return db.query(query)
.then((result)=>{
    if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    return result.rows;
})
}

//task 7
function updateArticleVotes(article_id,inc_votes){
    
    return db.query(`
        UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,[inc_votes,article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0]; 
        });

}

module.exports = {selectArticleById,selectArticle,updateArticleVotes}