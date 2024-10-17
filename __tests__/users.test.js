const request = require('supertest');
const app = require('../app')
const db = require('../db/connection');



afterAll(()=>db.end());

//task 10
describe('/api/users',()=>{
    test('200 : get all users',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            body.users.forEach((user)=>{
                expect(user).toMatchObject({
                    username:expect.any(String),
                    name:expect.any(String),
                    avatar_url:expect.any(String)
                })
            })
        })
    })
})