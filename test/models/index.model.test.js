/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;

chai.use(chaiAsPromised);

const { connectDB, disconnectDB } = require('../../src/models/index.model');

describe('#Index Models Test', () => {
  it('Should connecting to database with no error', async () => {
    if (process.env.NODE_ENV !== 'test') {
      await expect(connectDB()).fulfilled;
    }
    await expect(connectDB()).fulfilled;
  });
  it('should disconnection to database with no error', async () => {
    await expect(disconnectDB()).fulfilled;
  });
});
