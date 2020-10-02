/* eslint-disable no-plusplus */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test';

const supertest = require('supertest');

const { expect } = require('chai');

const App = require('../../src/app');

const testApp = new App();
testApp.listenPort(5002);

const { connectDB, connection } = require('../../src/models/index.model');

const Customer = require('../../src/models/customer.model');

const {
  data, sameEmailData, updData, ripData
} = require('../../src/data/dummy');

describe('#Customer API Tests', () => {
  before(async () => {
    await connectDB();
  });

  describe('#GET API Test', () => {
    before(async () => {
      await Customer.Create(data);
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        done();
      });
    });
    it('Should return a json response', () => {
      return supertest(testApp.app)
        .get('/api/v1/customers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });
    //! without id
    it('Should return same data inputed where it sended', async () => {
      return supertest(testApp.app)
        .get('/api/v1/customers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.result[0].first_name).to.equal('Dummys');
          expect(res.body.result[0].active).to.equal(0);
        });
    });

    //! with id
    it('Should return data if id customers match in parameters and database', async () => {
      return supertest(testApp.app)
        .get('/api/v1/customers/2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.result.id).to.equal(2);
        });
    });
    it('Should return error 404 code if id not found in database', async () => {
      return supertest(testApp.app)
        .get('/api/v1/customers/3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.err_message).is.exist;
        });
    });
  });
  describe('#POST API Test', () => {
    before(async () => {
      await Customer.Create(data);
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        return done();
      });
    });

    it('Should works returning 201 code and a json response', async () => {
      return supertest(testApp.app)
        .post('/api/v1/customers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(updData)
        .expect(201)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.err_message).is.not.exist;
        });
    });
    // it('Should return 500 code if got an errors from server', async () => {
    //   return supertest(testApp.app)
    //     .post('/api/v1/customers')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .send({ act: true })
    //     .expect(500)
    //     .then((res) => {
    //       expect(res.body.code).to.equal(500);
    //       expect(res.body.success).to.equal(false);
    //     });
    // });
    it('Should return errors 400 code if client have bad request', async () => {
      return supertest(testApp.app)
        .post('/api/v1/customers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(ripData)
        .expect(400)
        .then((res) => {
          expect(res.body.code).to.equal(400);
          expect(res.body.success).to.equal(false);
        });
    });
    it('Should return validation errors with 400 code if client send email already existed in database', async () => {
      return supertest(testApp.app)
        .post('/api/v1/customers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .send(sameEmailData)
        .then((res) => {
          expect(res.body.validation_errors).is.exist;
          expect(res.body.validation_errors[0].msg).to.equal('Email is already used!');
        });
    });
    it('Should return 429 code if client requesting more than 10 in 1 minutes', async () => {
      // eslint-disable-next-line no-shadow
      const agent = supertest(testApp.app);
      for (let i = 0; i <= 6; i++) {
        // eslint-disable-next-line no-await-in-loop
        await agent.post('/api/v1/customers')
          .expect('Content-Type', /json/)
          .expect(400)
          .send(sameEmailData);
      }
      return agent.post('/api/v1/customers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(429)
        .send(sameEmailData)
        .then((res) => {
          expect(res.body.err_message).to.equal('Too Many Request,try again later');
        });
    });
  });
  describe('#PUT API Test', () => {
    before(async () => {
      await Customer.Create(data);
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        return done();
      });
    });
    it('Should works updating, returning 200 code and a json response', async () => {
      return supertest(testApp.app)
        .put('/api/v1/customers/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(updData)
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.err_message).is.not.exist;
        });
    });
    it('Should return error 400 code if client have sent a bad request to server', async () => {
      return supertest(testApp.app)
        .put('/api/v1/customers/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(ripData)
        .expect(400)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.validation_errors).is.exist;
        });
    });
    it('Should return error 404 code if id not found in database', async () => {
      return supertest(testApp.app)
        .put('/api/v1/customers/3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(updData)
        .expect(404)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.err_message).is.exist;
        });
    });
  });
  describe('#DELETE API Test', () => {
    before(async () => {
      await Customer.Create(data);
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        return done();
      });
    });
    it('Should works deleting, returning 200 code and a json response', async () => {
      return supertest(testApp.app)
        .delete('/api/v1/customers/1')
        .expect(200)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.err_message).is.not.exist;
        });
    });
    it('Should return error 404 code if id not found in database', async () => {
      return supertest(testApp.app)
        .delete('/api/v1/customers/3')
        .expect(404)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.err_message).is.exist;
        });
    });
  });
});
