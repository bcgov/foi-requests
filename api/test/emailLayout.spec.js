'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(require('chai-string'));
chai.use(chaiAsPromised);
const expect = chai.expect;

// const sinon = require('sinon');
const emailLayout = require('../emailLayout');

let sampleRequestData = null; 

function scrubAttribs(result) {
  result = result.replace(/\r\n|\n|\r/gm, ''); // all linebreaks
  result = result.replace(/style="[^"]*"/gm, ''); // styles
  result = result.replace(/width="[^"]*"/gm, ''); // various table attribs
  result = result.replace(/cellpadding="[^"]*"/gm, '');
  result = result.replace(/cellspacing="[^"]*"/gm, '');
  // Add linebreaks for readability
  result = result.replace(/<tbody>[\s]*/gm, '<tbody>\n'); // linebreak after tbody
  result = result.replace(/<\/tr>[\s]*<tr/gm, '</tr>\n<tr'); // linebreak after tr
  result = result.replace(/<t(\w+)[\s]*>/gm, '<t$1>'); // no whitespace in a tr, td etc.
  return result;
}

describe('emailLayout', function() {
  beforeEach(function() {
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
      phonePrimary: '7786790628',
      phoneSecondary: '+1 07786772924',
      email: 'mark@binaryops.ca',
      address: '108-2260 Maple Ave N.',
      city: 'Sooke',
      postal: 'V9Z 1L2',
      province: 'British Columbia',
      country: 'Canada'
    }
  };  
  });

  it('should exist and have the expected functions', function() {
    expect(emailLayout).to.exist;
    // Make sure all the functions are as expected
    const fx = [
      'table',
      'tableHeader',
      'tableRow',
      'dateFormat',
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
    expect(Object.keys(emailLayout).length).to.equal(10);
  });

  it('should render table and headers', function() {
    let table = emailLayout.table('Hello World');
    // strip any newlines!
    table = table.replace(/\r\n|\n|\r/gm, '');
    expect(table).to.startsWith('<table');
    expect(table).to.contain('>Hello World</');
    expect(table).to.endsWith('</table>');
  });

  it('should render table headers', function() {
    let table = emailLayout.tableHeader('Hello World');
    // strip any newlines!
    table = table.replace(/\r\n|\n|\r/gm, '');
    expect(table).to.startsWith('<tr><th');
    expect(table).to.endsWith('>Hello World</th></tr>');
  });

  it('should render table rows', function() {
    let table = emailLayout.tableRow('Hello', 'World');
    // strip any newlines!
    table = table.replace(/\r\n|\n|\r/gm, '');
    expect(table).to.startsWith('<tr>');
    expect(table).to.contain('>Hello</td></tr>');
    expect(table).to.endsWith('>World</td></tr>');
  });

  it('should reformat html5 dates', function() {
    const dateStr = emailLayout.dateFormat('1972-04-29');
    expect(dateStr).to.equal('29/04/1972');
    // No requirement on numeric values!
    const invalidDateStr = emailLayout.dateFormat('aaaa-bb-cc');
    expect(invalidDateStr).to.equal('cc/bb/aaaa');
  });

  it('should format general data', function() {
    let result = emailLayout.general(sampleRequestData.descriptionTimeframe);
    result = scrubAttribs(result); // <--- magic
    expect(result).to.equal(`<tr><th>Request Description</th></tr>
<tr><td>Topic</td></tr>
<tr><td>Adoption</td></tr>
<tr><td>Description</td></tr>
<tr><td>Foosball tables</td></tr>
<tr><td>From <small>(dd/mm/yyyy)</small></td></tr>
<tr><td>01/03/2019</td></tr>
<tr><td>To <small>(dd/mm/yyyy)</small></td></tr>
<tr><td>08/03/2019</td></tr>
<tr><td>Public Service Employee Number</td></tr>
<tr><td>Pub-456789</td></tr>
<tr><td>Correctional Service Number</td></tr>
<tr><td>Corr-654321</td></tr>`);
  });


  it('should format general data, without personal numbers', function() {
    delete sampleRequestData.descriptionTimeframe['publicServiceEmployeeNumber'];
    delete sampleRequestData.descriptionTimeframe['correctionalServiceNumber'];

    let result = emailLayout.general(sampleRequestData.descriptionTimeframe);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Request Description</th></tr>
<tr><td>Topic</td></tr>
<tr><td>Adoption</td></tr>
<tr><td>Description</td></tr>
<tr><td>Foosball tables</td></tr>
<tr><td>From <small>(dd/mm/yyyy)</small></td></tr>
<tr><td>01/03/2019</td></tr>
<tr><td>To <small>(dd/mm/yyyy)</small></td></tr>
<tr><td>08/03/2019</td></tr>`);
  });

  //   it('should format ministry data', function() {
  //     let result = emailLayout.ministry(sampleRequestData);
  //     result = result.replace(/\r\n|\n|\r/gm, '');
  //     // expect(result).to.startWith('<tr><th');
  //     // expect(result).to.contain('>Topic</td></tr>');
  //     // expect(result).to.contain('>Adoption</td></tr>');
  //     // expect(result).to.contain('>Description</td></tr>');
  //     // expect(result).to.contain('>Foosball tables</td></tr>');
  //     // expect(result).to.contain('>From <small>(dd/mm/yyyy)</small></td></tr>');
  //     // expect(result).to.contain('>01/03/2019</td></tr>');
  //     // expect(result).to.contain('>To <small>(dd/mm/yyyy)</small></td></tr>');
  //     // expect(result).to.contain('>08/03/2019</td></tr>');
  //     expect(result).to.endWith('</td></tr>');
  //   });
});
