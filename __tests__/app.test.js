const request = require('supertest');
const app = require('../app')
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endpoints = require("../endpoints.json")


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
                body.articles.forEach(article => {
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