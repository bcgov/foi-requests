'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const axios = require('axios');

const apiCustomFunctions = require('../apiCustomFunctions');

describe('apiCustomFunctions - identity verification', function () {
  let axiosPostStub;

  beforeEach(function () {
    axiosPostStub = sinon.stub(axios, 'post').resolves({
      status: 200,
      data: {
        status: true,
        id: 12345
      }
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  const createRequest = (isAuthorised, overrides = {}) => {
    const requestData = {
      requestType: {
        requestType: 'general'
      },
      contactInfo: {},
      ...overrides
    };

    return {
      params: {
        requestData: JSON.stringify(requestData)
      },
      isAuthorised,
      log: {
        info: sinon.spy()
      }
    };
  };

  it('sets identityVerified to BC Services Card for an authenticated request', async function () {
    const request = createRequest(true);
    const response = {
      send: sinon.spy()
    };
    const next = sinon.spy();

    await apiCustomFunctions.submitFoiRequest(
      {},
      request,
      response,
      next
    );

    expect(axiosPostStub.calledOnce).to.equal(true);

    const outgoingPayload = JSON.parse(
      axiosPostStub.firstCall.args[1]
    );

    expect(outgoingPayload.requestData.identityVerified)
      .to.equal('BC Services Card');
  });

  it('sets identityVerified to null for an unauthenticated request', async function () {
    const request = createRequest(false);
    const response = {
      send: sinon.spy()
    };
    const next = sinon.spy();

    await apiCustomFunctions.submitFoiRequest(
      {},
      request,
      response,
      next
    );

    const outgoingPayload = JSON.parse(
      axiosPostStub.firstCall.args[1]
    );

    expect(outgoingPayload.requestData.identityVerified)
      .to.equal(null);
  });

  it('overwrites a spoofed client identityVerified value when unauthenticated', async function () {
    const request = createRequest(false, {
      identityVerified: 'BC Services Card'
    });

    const response = {
      send: sinon.spy()
    };
    const next = sinon.spy();

    await apiCustomFunctions.submitFoiRequest(
      {},
      request,
      response,
      next
    );

    const outgoingPayload = JSON.parse(
      axiosPostStub.firstCall.args[1]
    );

    expect(outgoingPayload.requestData.identityVerified)
      .to.equal(null);
  });
});
