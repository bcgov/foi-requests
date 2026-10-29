'use strict';

const assert = require('node:assert/strict');
const sinon = require('sinon');
const axios = require('axios');
const { EmailLayout } = require('../emailLayout');
const apiCustomFunctions = require('../apiCustomFunctions');

// Fixed expected wall times retain historical winters and the final spring
// transition. They also detect stale runtime data after the cancelled fallback.
const cases = [
  ['2025-01-15T20:00:00Z', 'Wednesday, Jan 15, 2025, 12:00 PM'],
  ['2026-01-15T20:00:00Z', 'Thursday, Jan 15, 2026, 12:00 PM'],
  ['2026-03-08T09:59:59Z', 'Sunday, Mar 8, 2026, 01:59 AM'],
  ['2026-03-08T10:00:00Z', 'Sunday, Mar 8, 2026, 03:00 AM'],
  ['2026-11-01T08:59:59Z', 'Sunday, Nov 1, 2026, 01:59 AM'],
  ['2026-11-01T09:00:00Z', 'Sunday, Nov 1, 2026, 02:00 AM'],
  ['2026-11-03T07:30:00Z', 'Tuesday, Nov 3, 2026, 12:30 AM'],
  ['2026-11-02T23:31:00Z', 'Monday, Nov 2, 2026, 04:31 PM'],
  ['2027-01-15T19:00:00Z', 'Friday, Jan 15, 2027, 12:00 PM'],
];

function requestData() {
  return {
    requestType: { requestType: 'personal' },
    contactInfo: { firstName: 'Timezone', lastName: 'Fixture' },
    contactInfoOptions: { email: 'timezone-fixture@example.invalid' },
    ministry: { selectedMinistry: [{ publicBody: 'Fixture', name: 'Fixture' }] },
  };
}

for (const hostZone of ['UTC', 'America/Vancouver', 'America/Los_Angeles']) {
  describe(`submission footer with process timezone ${hostZone}`, function () {
    let originalZone;

    beforeEach(function () {
      originalZone = process.env.TZ;
      process.env.TZ = hostZone;
    });

    afterEach(function () {
      sinon.restore();
      if (originalZone === undefined) delete process.env.TZ;
      else process.env.TZ = originalZone;
    });

    for (const [instant, expected] of cases) {
      it(`renders ${instant} as ${expected}`, function () {
        sinon.useFakeTimers({ now: new Date(instant), toFake: ['Date'] });
        const html = new EmailLayout().renderEmail({ requestData: requestData() });
        assert.ok(html.includes(`Submitted ${expected}`), html.match(/Submitted [^<]+/)?.[0]);
      });
    }

    it('uses Pacific Time wording without a fixed PST/PDT label', function () {
      sinon.useFakeTimers({ now: new Date('2026-11-03T07:30:00Z'), toFake: ['Date'] });
      const html = new EmailLayout().renderEmail({ requestData: requestData() });
      assert.match(html, /Submitted [^<]+ Pacific Time<\/th>/);
      assert.doesNotMatch(html, /\b(?:PST|PDT)\b/);
    });
  });
}

describe('submission email and request-details PDF timezone integration', function () {
  afterEach(function () { sinon.restore(); });

  for (const paid of [false, true]) {
    it(`renders the correct B.C. date for the ${paid ? 'paid' : 'unpaid'} submission outputs`, async function () {
      sinon.useFakeTimers({ now: new Date('2026-11-03T07:30:00Z'), toFake: ['Date'] });
      sinon.stub(console, 'log');
      sinon.stub(console, 'trace');
      const emails = [];
      const pdfHtml = [];
      const pdfBytes = Buffer.from('fixture request-details PDF');
      sinon.stub(axios, 'post').callsFake(async (url, body) => {
        if (url.endsWith('/requestreceipt')) {
          pdfHtml.push(JSON.parse(body).requestHTML);
          return { status: 200, data: pdfBytes };
        }
        if (url.endsWith('/receipt')) {
          return { status: 200, data: Buffer.from('fixture payment receipt') };
        }
        assert.ok(url.endsWith('/foirawrequests'), `Unexpected request: ${url}`);
        return { status: 200, data: { status: true, id: 12345 } };
      });
      const server = { registry: { get: () => ({
        sendFromNoReply: (email, callback) => {
          emails.push(email);
          callback(null, { accepted: true });
        },
      }) } };
      const data = requestData();
      if (paid) {
        data.requestType.requestType = 'general';
        data.requestId = 12345;
        data.paymentInfo = {
          paymentId: 123,
          transactionDate: '2026-11-03',
          amount: '10.00',
        };
      }
      const req = {
        params: { requestData: JSON.stringify(data) },
        log: { info: sinon.stub() },
      };
      const res = { send: sinon.spy() };
      const next = sinon.spy();
      const submit = paid ? apiCustomFunctions.submitFoiRequestEmail : apiCustomFunctions.submitFoiRequest;
      await submit(server, req, res, next);

      assert.equal(res.send.callCount, 1, next.firstCall?.args[0]?.stack);
      assert.equal(res.send.firstCall.args[0].EmailSuccess, true);
      assert.ok(next.getCalls().every(call => call.args.length === 0));
      const inboxEmail = emails.find(email => email.subject === 'FOI Request Submission');
      const applicantEmail = emails.find(email => email.subject === 'Receipt of FOI Request');
      assert.ok(inboxEmail);
      assert.equal(pdfHtml.length, 1);
      for (const html of [inboxEmail.html, pdfHtml[0]]) {
        assert.ok(html.includes('Submitted Tuesday, Nov 3, 2026, 12:30 AM Pacific Time'), html.match(/Submitted [^<]+/)?.[0]);
      }
      assert.ok(applicantEmail);
      const requestDetails = applicantEmail.attachments.find(file => file.filename === 'RequestDetails.pdf');
      assert.equal(Buffer.from(requestDetails.content, 'base64').toString(), pdfBytes.toString());
    });
  }
});
