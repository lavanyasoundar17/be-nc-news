const db = require('../db/connection');

function selectArticleById(article_id){
      
      const query = `
      SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, 
             articles.created_at, articles.votes, articles.article_img_url,
             COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
  `;
  return db.query(query, [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0]; 
        });

}


//task 5&task 11
function selectArticle(sort_by= 'created_at',order = 'desc',topic=null){

    if(!sort_by){
        sort_by = 'created_at';
    }
    if(!order){
        order = 'desc';
    }

    const query = `
        SELECT articles.article_id, articles.title, articles.author, articles.topic, 
               articles.created_at, articles.votes, articles.article_img_url,
               COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        ${topic ? 'WHERE articles.topic ILIKE $1' : ''}
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};
    `;
    const queryParams = topic ? [topic] : [];

       return db.query(query,queryParams)
       
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