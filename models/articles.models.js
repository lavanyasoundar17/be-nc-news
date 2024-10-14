const db = require('../db/connection');

function selectArticleById(article_id){
    return db.query('SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        return result.rows[0]; 
    });
}

//task 5
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
    return result.rows;
})
}


module.exports = {selectArticleById,selectArticle}