const { selectTopics } = require('../models/topics.models.js');


function getTopics(req,res,next){
    return selectTopics()
        .then((topics) => {
          if (!topics) {
            return res.status(404).send({ msg: 'Not Found' });
        }
          res.status(200).send({ topics });
        })
        .catch(next);
}

module.exports = {getTopics}