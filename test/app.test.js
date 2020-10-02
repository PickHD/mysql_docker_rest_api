/* eslint-disable no-unused-expressions */
process.env.NODE_ENV = 'test';

const chai = require('chai');

const _ = require('lodash');

const { expect } = chai;

const App = require('../src/app');

describe('#App Test', () => {
  const app = new App();

  it('Should be returning a object after creating new instance', () => {
    expect(_.isObject(app)).to.be.true;
  });
});
