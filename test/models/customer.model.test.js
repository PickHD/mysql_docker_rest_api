/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;
chai.use(chaiAsPromised);

const _ = require('lodash');

const { connectDB, connection } = require('../../src/models/index.model');

const Customer = require('../../src/models/customer.model');
const { data, badData, updData } = require('../../src/data/dummy');

describe('#Customer Models Test', () => {
  before(async () => {
    await connectDB();
  });
  describe('#Get Data Customer (all or with spec.id or spec.email)', () => {
    before(async () => {
      await Customer.Create(data);
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        done();
      });
    });
    //! ALL DATA 
    it('Should returning object while getting all data customers', async () => {
      const getAllData = await Customer.FindAll();
      expect(_.isObject(getAllData)).to.be.true;
    });
    //! SPECIFIC DATA WITH ID
    it('Should returning object while getting specific data with id customer', async () => {
      const getOneData = await Customer.FindOne(1);
      expect(_.isObject(getOneData)).to.be.true;
    });
    it('Should rejected if get one data an errors', async () => {
      await expect(Customer.FindOne()).rejected;
    });
    it('Should return empty if one data not found', async () => {
      expect(Customer.FindOne(3)).is.empty;
    });

    //! SPECIFIC DATA WITH EMAIL
    it('Should returning object while getting specific one data with email customer', async () => {
      const getOneEmail = await Customer.FindByEmail('dummydata35@gmail.com');
      expect(_.isObject(getOneEmail)).to.be.true;
    });
    it('Should rejected if get an errors', async () => {
      await expect(Customer.FindByEmail()).rejected;
    });
    it('Should return empty if email not found', async () => {
      expect(Customer.FindByEmail('fakedummy35@gmail.com')).is.empty;
    });
  });
  describe('#Inserting Data Customer', () => {
    before((done) => {
      done();
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        done();
      });
    });

    it('Should Fulfilled if getting no errors', async () => {
      await expect(Customer.Create(data)).fulfilled;
    });
    it('Should Rejected if get a errors', async () => {
      await expect(Customer.Create(badData)).rejected;
    });
  });
  describe('#Updating Data Customer', () => {
    before(async () => {
      await Customer.Create(data);
    });
    after((done) => {
      connection.query('TRUNCATE customers', (err) => {
        if (err) throw err;
        done();
      });
    });
    it('Should Fullfiled if getting no errors', async () => {
      await expect(Customer.Update(updData, 1)).fulfilled;
    });
    it('Should Rejected if get a errors', async () => {
      await expect(Customer.Update(badData, 1)).rejected;
    });
  });
  describe('#Deleting Data Customer', () => {
    before(async () => {
      await Customer.Create(data);
    });

    it('Should Fullfiled if getting no errors', async () => {
      await expect(Customer.Remove(1)).fulfilled;
    });
    it('Should Rejected if get a errors', async () => {
      await expect(Customer.Remove()).rejected;
    });
    it('Should return empty if data not found', async () => {
      expect(Customer.Remove(3)).is.empty;
    });
  });
});
