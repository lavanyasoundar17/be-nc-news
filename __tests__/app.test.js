const request = require('supertest');
const app = require('../app')
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endpoints = require("../endpoints.json");
require('jest-sorted');



beforeEach(()=>seed(data));
afterAll(()=>db.end());

describe('/api/topics', () => {
    test('200: get all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            body.topics.forEach(topics =>{
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
                const dates = articles.map(article => new Date(article.created_at).getTime());

                expect(articles.length).toBeGreaterThan(0);

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

                expect(dates).toEqual([...dates].sort((a, b) => b - a));  
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

                expect(comments.length).toBeGreaterThan(0);

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
