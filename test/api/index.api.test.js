process.env.NODE_ENV = 'test';

const supertest = require('supertest');

const App = require('../../src/app');

const testApp = new App();
testApp.listenPort(4022);

describe('#Index API Test', () => {
  it('should return a json response', (done) => {
    supertest(testApp.app)
      .get('/api/v1/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
