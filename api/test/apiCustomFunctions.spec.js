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

  let transomSmtp;

  beforeEach(function() {
    const registry = new PocketRegistry();
    server = {
      registry
    };
    server.registry.set('transomTemplate', {
      renderEmailTemplate: sinon.spy()
    });
    transomSmtp = {
      sendFromNoReply: ({}, sinon.spy())
    };
    server.registry.set('transomSmtp', transomSmtp);
  });

  it('includes a submitFoiRequest function', function() {
    expect(apiCustomFunctions.submitFoiRequest).to.exist;
    expect(Object.keys(apiCustomFunctions).length).to.equal(1);
  });

  it('submitFoiRequest does stuff, then calls next()', function() {
    const request = {params:{}, log:{}};
    request.log.info = function(s){};
    const requestData = JSON.stringify({requestType:{}});
    request.params.requestData = requestData;
    const response = {};
    const next = function(resolve, reject) {
      resolve(true)
    };
    const p = new Promise(next)
    
    apiCustomFunctions.submitFoiRequest(server, request, response, next);
    expect(p).to.eventually.fulfilled;
    expect(transomSmtp.sendFromNoReply.getCall(0).args[0].subject).to.equal("Newer FOI Request");
      
  });
});
