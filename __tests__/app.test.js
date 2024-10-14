const request = require('supertest');
const app = require('../app')
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');


beforeEach(()=>seed(data));
afterAll(()=>db.end());

describe('/api/topics', () => {
    test('200: get all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics).toBeInstanceOf(Array);
          expect(body.topics[0]).toMatchObject({slug:expect.any(String), description:expect.any(String)});
        });
    });
    test('404: responds with a 404 error for an invalid endpoint', () => {
        return request(app)
            .get('/api/invalid-endpoint')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found');
            });
    });
  });