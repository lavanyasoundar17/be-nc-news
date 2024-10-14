const db = require('../db/connection');

function selectTopics() {
    
  return db.query('SELECT slug, description FROM topics;')
    .then((result) => {
      return result.rows;
    });
};

module.exports = {selectTopics}
