const {selectUsers} = require('../models/users.models.js');

function getUsers (req,res,next){
    return selectUsers()
    .then((users)=>{
        res.status(200).send({users})
    })
    .catch(next);
}

module.exports ={getUsers};