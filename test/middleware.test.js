/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const App = require('../src/app');

const testApp = new App();
testApp.listenPort(3000);

const { connection, connectDB } = require('../src/models/index.model');

describe('#Middleware Test', () => {
  beforeEach((done) => {
    connectDB();
    connection.query('DROP TABLE IF EXISTS customers', (err) => {
      if (err) done(err);
      done();
    });
  });

  afterEach((done) => {
    connection.query('CREATE TABLE IF NOT EXISTS customers LIKE restapi_mysql.customers', (err) => {
      if (err) done(err);
      done();
    });
  });
  it('should return 404 code if route not exists', () => {
    return supertest(testApp.app)
      .get('/api/v2/customers')
      .expect(404);
  });
  it('should return 500 code if got a unhandled errors', async () => {
    return supertest(testApp.app)
      .get('/api/v1/customers')
      .then((res) => {
        expect(res.body.code).to.equal(500);
        expect(res.body.success).to.equal(false);
        expect(res.body.err_message).is.exist;
        expect(res.body.stack).is.exist;
      });
  });
});
