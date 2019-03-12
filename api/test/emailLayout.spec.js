'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

// const sinon = require('sinon');
const emailLayout = require('../emailLayout');

describe('emailLayout', function() {
  beforeEach(function() {});

  it('should exist and have the expected functions', function() {
    expect(emailLayout).to.exist;
    // Make sure all the functions are as expected
    const fx = [
      'table',
      'tableHeader',
      'tableRow',
      'general',
      'ministry',
      'personal',
      'contact',
      'about',
      'renderEmail'
    ];
    fx.map(fxName => {
      expect(emailLayout[fxName]).to.exist;
    });
    expect(Object.keys(emailLayout).length).to.equal(9);
  });
});
