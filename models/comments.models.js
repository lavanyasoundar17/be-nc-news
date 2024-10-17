const db = require('../db/connection');

function selectCommentsByArticleId(article_id) {
      
    return db.query(`
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
    `, [article_id])
    .then((result) => {
        return result.rows; 
    });
}

//task 7
function insertCommentByArticleId(article_id,username,body){
    if (username===undefined && body===undefined) {
        return Promise.reject({ status: 400, msg: 'Bad request: missing required fields' });
    }
      const queryStr = `INSERT INTO comments (author,body,article_id,votes,created_at)
      VALUES ($1,$2,$3,0,NOW())
      RETURNING author, body, article_id, votes, created_at;`

      return db.query(queryStr, [username, body, article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0]; 
        });

}


//task 9
function selectCommentsByCommentsId(comment_id){
    
return db.query (`DELETE FROM comments WHERE comment_id =$1 RETURNING *;`,[comment_id])
.then((result)=>{
    if (result.rows.length === 0) {
        
        return Promise.reject({ status: 404, msg: 'Comment not found' });
    }
    return result.rows[0];

})
}

module.exports = { selectCommentsByArticleId,insertCommentByArticleId,selectCommentsByCommentsId };
