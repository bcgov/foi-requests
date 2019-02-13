'use strict';
const PocketRegistry = require('pocket-registry');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const sinon = require('sinon');
const apiCustomFunctions = require('../apiCustomFunctions');

let server;
describe('apiCustomFunctions', function() {
  beforeEach(function() {
    const registry = new PocketRegistry();
    server = {
      registry
    };
    server.registry.set('transomTemplate', {
      renderEmailTemplate: sinon.spy()
    });
    server.registry.set('transomSmtp', {
      sendFromNoReply: ({}, sinon.spy())
    });
  });

  it('includes a submitFoiRequest function', function() {
    expect(apiCustomFunctions.submitFoiRequest).to.exist;
    expect(Object.keys(apiCustomFunctions).length).to.equal(1);
  });

  it('submitFoiRequest does stuff, then calls next()', function() {
    const request = {};
    const response = {};
    const next = () => {
      Promise.resolve();
    };
    expect(apiCustomFunctions.submitFoiRequest(server, request, response, next))
      .to.eventually.be.fulfilled;
  });
});
