const request = require('supertest');
const app = require('../app')
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endpoints = require("../endpoints.json");
const { string } = require('pg-format');
require('jest-sorted');



beforeEach(()=>seed(data));
afterAll(()=>db.end());

describe('/api/topics', () => {
    test('200: get all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            const topics = body.topics;
            expect(topics.length).toBe(3);
            topics.forEach(topics =>{
                expect(topics).toMatchObject({slug:expect.any(String), description:expect.any(String)});
            });
        });
    });
  });

  describe("/api",()=>{
    test("200 : responds with an object detailing all available endpoints",()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body})=>{
            expect(body.endpoints).toEqual(endpoints)
        })
    });
    test('404: responds with a 404 error for an invalid endpoint', () => {
        return request(app)
            .get('/api/invalid-endpoint')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found');
            });
    });
})

//task-4
describe("/api/articles/:article_id",()=>{
    test("200:responds with an article for valid article_id ",()=>{
        return request(app)
        .get(`/api/articles/1`)
        .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
            
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number)
        });
      });

    });
    test("404: responds with 'Not Found' when given a non-existing article ID", () => {
        return request(app)
          .get("/api/articles/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
      test("400: responds with 'Bad Request' when given an invalid article ID", () => {
        return request(app)
          .get("/api/articles/not-a-number")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
})

//task 5
describe('/api/articles', () => {
    test('200: responds with an array of articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                expect(articles.length).toBe(13);

                articles.forEach(article => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        author: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String),
                    });
                });

                expect(articles).toBeSortedBy('created_at', { descending: true }); 
            });
    });

    test('404: responds with "Not Found" for an invalid endpoint', () => {
        return request(app)
            .get('/api/invalid-endpoint')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found');
            });
    });
});
//task 6
describe('/api/articles/:article_id/comments', () => {
    test('200: responds with an array of comments for a valid article_id', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                const comments =  body.comments;

                expect(comments.length).toBe(11);

                comments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                    });
                });
            });
    });
    test('200: responds with comments sorted by most recent first', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            const comments  = body.comments;
            expect(comments).toBeSortedBy('created_at', { descending: true });
          });
      });
      test('200: responds with an empty array when the article has no comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toEqual([]);
          });
      });

    test('404: responds with "Article not found" for a non-existing article ID', () => {
        return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test("400: responds with 'Bad Request' when given an invalid article ID", () => {
        return request(app)
            .get("/api/articles/not-a-number/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});

//task 7
describe('POST /api/articles/:article_id/comments',()=>{
    test("201: responds with posted comment",()=>{
        return request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'butter_bridge', body: 'Great article!' })
        .expect(201)
        .then(({body})=>{
            expect(body.comment).toEqual({
                body: "Great article!",
                 votes: 0,
                 author: "butter_bridge",
                 article_id: 1,
                created_at: expect.any(String)
            })
        })
    });
    test('404: responds with error when article_id does not exist', () => {
        return request(app)
            .post('/api/articles/9999/comments')
            .send({ username: 'butter_bridge', body: 'Great article!' })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('400: responds with error when article_id is not a valid number', () => {
        return request(app)
            .post('/api/articles/not-a-number/comments')
            .send({ username: 'butter_bridge', body: 'Great article!' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
})

//task 8
describe('PATCH /api/articles/:article_id', () => {
    test('200: responds with the updated article when incrementing votes', () => {
        return request(app)
            .patch('/api/articles/2')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 2,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: 1
                });
            });
    });

    test('200: responds with the updated article when decrementing votes', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    article_id: 1,
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: 99
                });
            });
    });

    test('400: responds with "Bad request" when inc_votes is missing', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request: missing required fields');
            });
    });

    test('404: responds with "Article not found" for a non-existing article ID', () => {
        return request(app)
            .patch('/api/articles/9999')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

});
//task 9
describe('DELETE /api/comments/:comment_id', () => {
    test('204: deletes the comment and responds with no content', () => {
        return request(app)
            .delete('/api/comments/1') 
            .expect(204); 
    });

    test('404: responds with "Comment not found" for a non-existent comment_id', () => {
        return request(app)
            .delete('/api/comments/9999') 
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found');
            });
    });

    test('400: responds with "Bad request" when comment_id is not a number', () => {
        return request(app)
            .delete('/api/comments/not-a-number') 
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request: invalid comment_id');
            });
    });
});

//task 10
describe('/api/users',()=>{
    test('200 : get all users',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            const users = body.users;
            expect(users.length).toBe(4);
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


