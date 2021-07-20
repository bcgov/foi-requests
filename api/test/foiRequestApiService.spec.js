'use strict';
const sinon = require('sinon');
const RequestAPI = require('../foiRequestApiService');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(require('chai-string'));
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('requestAPIervice', () => {
    beforeEach( () => {
        requestAPIService = new RequestAPI();
        stub = sinon.stub(axios, "post");
        foiRequestAPIBackend = process.env.FOI_REQUEST_API_BACKEND;
        apiUrl = `${foiRequestAPIBackend}/foirawrequests`;
        sampleRequestData = {
            requestType: {
              requestType: 'personal'
            },
            selectAbout: {
              yourself: true,
              child: null,
              another: null
            },
            ministry: {
              defaultMinistry: {
                code: 'MCF',
                name: 'Children and Family Development'
              },
              selectedMinistry: [
                {
                  code: 'MCF',
                  name: 'Children and Family Development',
                  defaulted: true,
                  selected: true
                }
              ],
              ministryPage: '/personal/ministry-confirmation'
            },
            contactInfo: {
              firstName: 'Colin',
              middleName: 'Jack',
              lastName: 'Westfall',
              birthDate: timezoneAdjust('2019-02-28T00:00:00.000Z'),
              alsoKnownAs: 'The Shuffler',
              businessName: "Province of B.C., Ministry of Citizens' Services"
            },
            anotherInformation: {
              firstName: 'Colin',
              middleName: 'Jack',
              lastName: 'Westfall',
              dateOfBirth: timezoneAdjust('2010-09-22T00:00:00.000Z'),
              alsoKnownAs: 'Mr. McGoo'
            },
            childInformation: {
              firstName: 'Johnny',
              middleName: 'Bobbert',
              lastName: 'Driscol',
              dateOfBirth: timezoneAdjust('2007-05-26T00:00:00.000Z'),
              alsoKnownAs: 'Little Johnny Driscol'
            },
            requestTopic: {
              value: 'adoption',
              text: 'Adoption',
              ministryCode: 'MCF'
            },
            descriptionTimeframe: {
              description: 'Foosball tables',
              fromDate: timezoneAdjust('2019-03-21T00:00:00.000Z'),
              toDate: timezoneAdjust('2019-03-28T00:00:00.000Z'),
              correctionalServiceNumber: 'Corr-654321',
              publicServiceEmployeeNumber: 'Pub-456789',
              topic: 'Adoption'
            },
            adoptiveParents: {
              motherFirstName: 'Marge',
              motherLastName: 'Westfall',
              fatherFirstName: 'Homer',
              fatherLastName: 'Westfall'
            },
            contactInfoOptions: {
              phonePrimary: '7785550628',
              phoneSecondary: '+1 077865552824',
              email: 'homer@springfield.com',
              address: '108-2260 Maple Ave N.',
              city: 'Sooke',
              postal: 'V9Z 1L2',
              province: 'British Columbia',
              country: 'Canada'
            },
            Attachments: []
          };
    });
    afterEach(() => {
        stub.restore();
    });

    it('should exist and have the expected functions', () => {
        expect(requestAPIService).to.exist;
        const fx = ['invokeRequestAPI'];
        fx.map(fxName => {
            expect(requestAPIService[fxName]).to.exist;
          });
          expect(Object.keys(requestAPIService).length).to.equal(1);
    });

    it("should send request with correct parameters", () => {
        
        requestAPIService.invokeRequestAPI(sampleRequestData, apiUrl);
        expect(
          stub.calledWith(apiUrl, {
            params: sampleRequestData
          })
        ).to.be.true;
      });
});