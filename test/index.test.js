/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test';

const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const App = require('../src/app');
const mainApp = require('../src/index');

const test = new App();

describe('#Index Test', () => {
  it('should works with no error', async () => {
    if (process.env.NODE_ENV === 'production') {
      await expect(mainApp.listenPort(8082)).fulfilled;
    } else if (process.env.NODE_ENV === 'test') {
      await expect(test.listenPort(8080)).fulfilled;
    }
  });
  it('should returning a handled error with rejected promise', (done) => {
    expect(test.listenPort(8080)).rejected;
    done();
  });
});
