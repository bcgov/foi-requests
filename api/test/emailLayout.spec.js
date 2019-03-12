'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(require('chai-string'));
chai.use(chaiAsPromised);
const expect = chai.expect;

// const sinon = require('sinon');
const emailLayout = require('../emailLayout');

const sampleRequest = {
  requestData: {
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
      birthDate: '2019-02-28',
      alsoKnownAs: 'The Shuffler',
      businessName: "Province of B.C., Ministry of Citizens' Services"
    },
    requestTopic: {
      value: 'adoption',
      text: 'Adoption',
      ministryCode: 'MCF'
    },
    descriptionTimeframe: {
      description: 'Foosball tables',
      fromDate: '2019-03-01',
      toDate: '2019-03-08',
      correctionalServiceNumber: null,
      publicServiceEmployeeNumber: null,
      topic: 'Adoption'
    },
    adoptiveParents: {
      motherFirstName: 'Marge',
      motherLastName: 'Westfall',
      fatherFirstName: 'Homer',
      fatherLastName: 'Westfall'
    },
    contactInfoOptions: {
      phonePrimary: '7786790628',
      phoneSecondary: '+1 07786772924',
      email: 'mark@binaryops.ca',
      address: '108-2260 Maple Ave N.',
      city: 'Sooke',
      postal: 'V9Z 1L2',
      province: 'British Columbia',
      country: 'Canada'
    }
  }
};

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

  it('should render table and headers', function() {

    let table = emailLayout.table('Hello World');
    // strip any newlines!
    table = table.replace((/  |\r\n|\n|\r/gm),"");;
    expect(table).to.startsWith("<table");
    expect(table).to.contain(">Hello World</");
    expect(table).to.endsWith("</table>");
  });
});
