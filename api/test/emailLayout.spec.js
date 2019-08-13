'use strict';
const sinon = require('sinon');
const EmailLayout = require('../emailLayout');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(require('chai-string'));
chai.use(chaiAsPromised);
const expect = chai.expect;

// Initialized before each test
let sampleRequestData = null;
let emailLayout = null;

function stdTimezoneOffset(dateVal) {
  const jan = new Date(dateVal.getFullYear(), 0, 1);
  const jul = new Date(dateVal.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

function timezoneAdjust(isoDateStr) {
  if (isoDateStr.indexOf('T00:00:00.000Z') === 10) {
    // Timezone-local equivalent of the same date, used in the tests.
    const adjustedDateStr = new Date(new Date(isoDateStr).getTime() + (stdTimezoneOffset(new Date()) * 60000)).toISOString();
    return adjustedDateStr;
  }
  return isoDateStr;
}

function scrubAttribs(result) {
  result = result.replace(/\r\n|\n|\r/gm, ''); // all linebreaks
  result = result.replace(/style="[^"]*"/gm, ''); // styles
  result = result.replace(/width="[^"]*"/gm, ''); // various table attribs
  result = result.replace(/cellpadding="[^"]*"/gm, '');
  result = result.replace(/cellspacing="[^"]*"/gm, '');
  // Add linebreaks for readability
  result = result.replace(/<tbody>[\s]*/gm, '<tbody>\n'); // linebreak after tbody
  result = result.replace(/<br>/gm, '<br>\n'); // linebreak after br
  result = result.replace(/<\/tr>[\s]*<tr/gm, '</tr>\n<tr'); // linebreak after tr
  result = result.replace(/<t(\w+)[\s]*>/gm, '<t$1>'); // no whitespace in a tr, td etc.
  return result;
}

describe('emailLayout', function() {
  beforeEach(function() {
    emailLayout = new EmailLayout();

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
      'joinBySpace',
      'general',
      'ministry',
      'personal',
      'anotherInformation',
      'adoptiveParents',
      'childInformation',
      'contact',
      'about',
      'renderEmail'
    ];
    fx.map(fxName => {
      expect(emailLayout[fxName]).to.exist;
    });
    expect(Object.keys(emailLayout).length).to.equal(14);
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
    const dateStr = emailLayout.dateFormat(timezoneAdjust('1972-04-29T00:00:00.000Z'));
    expect(dateStr).to.equal('04/29/1972');
    // No requirement on numeric values!
    const invalidDateStr = emailLayout.dateFormat('aaaa-bb-cc');
    expect(invalidDateStr).to.equal('aaaa-bb-cc');
  });

  it('should join multiple stings with spaces', function() {
    const nameStr = emailLayout.joinBySpace('James', 'Earl', 'Jones');
    expect(nameStr).to.equal('James Earl Jones');
    // With crazy extra whitespace!
    const altName = emailLayout.joinBySpace('\t  James', null, ' Jones    ');
    expect(altName).to.equal('James Jones');
  });

  it('should format general data', function() {
    let result = emailLayout.general(sampleRequestData.descriptionTimeframe);
    result = scrubAttribs(result); // <--- magic
    expect(result).to.equal(`<tr><th>Request Description</th></tr>
<tr><td>Description</td></tr>
<tr><td>Foosball tables</td></tr>
<tr><td>From <small>(mm/dd/yyyy)</small></td></tr>
<tr><td>03/21/2019</td></tr>
<tr><td>To <small>(mm/dd/yyyy)</small></td></tr>
<tr><td>03/28/2019</td></tr>
<tr><td>Public Service Employee Number</td></tr>
<tr><td>Pub-456789</td></tr>
<tr><td>Correctional Service Number</td></tr>
<tr><td>Corr-654321</td></tr>`);
  });

  it('should format general data, without personal numbers', function() {
    delete sampleRequestData.descriptionTimeframe[
      'publicServiceEmployeeNumber'
    ];
    delete sampleRequestData.descriptionTimeframe['correctionalServiceNumber'];

    let result = emailLayout.general(sampleRequestData.descriptionTimeframe);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Request Description</th></tr>
<tr><td>Description</td></tr>
<tr><td>Foosball tables</td></tr>
<tr><td>From <small>(mm/dd/yyyy)</small></td></tr>
<tr><td>03/21/2019</td></tr>
<tr><td>To <small>(mm/dd/yyyy)</small></td></tr>
<tr><td>03/28/2019</td></tr>`);
  });

  it('should format ministry data, with a defaultMinistry', function() {
    let result = emailLayout.ministry(sampleRequestData.ministry);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Ministry or Agency</th></tr>
<tr><td>Ministry</td></tr>
<tr><td>Children and Family Development</td></tr>`);
  });

  it('should format ministry data, with a multi-ministry selection', function() {
    sampleRequestData.ministry.selectedMinistry = [
      { code: 'GCPE', name: 'Government Communications and Public Engagement' },
      { code: 'HLTH', name: 'Health' },
      { code: 'IRR', name: 'Indigenous Relations and Reconciliation' },
      { code: 'LBR', name: 'Labour' },
      { code: 'SDPR', name: 'Social Development and Poverty Reduction' }
    ];

    let result = emailLayout.ministry(sampleRequestData.ministry);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Ministry or Agency</th></tr>
<tr><td>Ministry</td></tr>
<tr><td>Government Communications and Public Engagement<br>
Health<br>
Indigenous Relations and Reconciliation<br>
Labour<br>
Social Development and Poverty Reduction</td></tr>`);
  });

  it('should format personal data', function() {
    let result = emailLayout.personal(sampleRequestData.contactInfo);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Contact Information</th></tr>
<tr><td>Name</td></tr>
<tr><td>Colin Jack Westfall</td></tr>
<tr><td>Also Known As</td></tr>
<tr><td>The Shuffler</td></tr>
<tr><td>Business Name</td></tr>
<tr><td>Province of B.C., Ministry of Citizens' Services</td></tr>
<tr><td>Birth Date <small>(dd/mm/yyyy)</small></td></tr>
<tr><td>02/28/2019</td></tr>`);
  });

  it('should format personal data, without aka, middle or business names', function() {
    delete sampleRequestData.contactInfo['alsoKnownAs'];
    delete sampleRequestData.contactInfo['middleName'];
    delete sampleRequestData.contactInfo['businessName'];

    let result = emailLayout.personal(sampleRequestData.contactInfo);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Contact Information</th></tr>
<tr><td>Name</td></tr>
<tr><td>Colin Westfall</td></tr>
<tr><td>Birth Date <small>(dd/mm/yyyy)</small></td></tr>
<tr><td>02/28/2019</td></tr>`);
  });

  it('should format another persons data', function() {
    let result = emailLayout.anotherInformation(
      sampleRequestData.anotherInformation
    );
    result = scrubAttribs(result);

    expect(result).to.equal(`<tr><th>Another Person Information</th></tr>
<tr><td>Name</td></tr>
<tr><td>Colin Jack Westfall</td></tr>
<tr><td>Also Known As</td></tr>
<tr><td>Mr. McGoo</td></tr>
<tr><td>Date of Birth <small>(mm/dd/yyyy)</small></td></tr>
<tr><td>09/22/2010</td></tr>`);
  });

  it('should format another persons data, without DoB and aka', function() {
    delete sampleRequestData.anotherInformation['alsoKnownAs'];
    delete sampleRequestData.anotherInformation['dateOfBirth'];
    delete sampleRequestData.anotherInformation['lastName'];

    let result = emailLayout.anotherInformation(
      sampleRequestData.anotherInformation
    );
    result = scrubAttribs(result);

    expect(result).to.equal(`<tr><th>Another Person Information</th></tr>
<tr><td>Name</td></tr>
<tr><td>Colin Jack</td></tr>`);
  });

  it('should format adoptive parent data', function() {
    let result = emailLayout.adoptiveParents(sampleRequestData.adoptiveParents);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Adoptive Parents</th></tr>
<tr><td>Adoptive Mother</td></tr>
<tr><td>Marge Westfall</td></tr>
<tr><td>Adoptive Father</td></tr>
<tr><td>Homer Westfall</td></tr>`);
  });

  it('should format adoptive parent data, without mother', function() {
    delete sampleRequestData.adoptiveParents['motherFirstName'];
    delete sampleRequestData.adoptiveParents['motherLastName'];

    let result = emailLayout.adoptiveParents(sampleRequestData.adoptiveParents);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Adoptive Parents</th></tr>
<tr><td>Adoptive Mother</td></tr>
<tr><td>None</td></tr>
<tr><td>Adoptive Father</td></tr>
<tr><td>Homer Westfall</td></tr>`);
  });

  it('should format child data', function() {
    let result = emailLayout.childInformation(
      sampleRequestData.childInformation
    );
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Child Information</th></tr>
<tr><td>Name</td></tr>
<tr><td>Johnny Bobbert Driscol</td></tr>
<tr><td>Also Known As</td></tr>
<tr><td>Little Johnny Driscol</td></tr>
<tr><td>Date of Birth <small>(mm/dd/yyyy)</small></td></tr>
<tr><td>05/26/2007</td></tr>`);
  });

  it('should format child data, without middle name, aka or DoB', function() {
    delete sampleRequestData.childInformation['alsoKnownAs'];
    delete sampleRequestData.childInformation['dateOfBirth'];
    delete sampleRequestData.childInformation['middleName'];

    let result = emailLayout.childInformation(
      sampleRequestData.childInformation
    );
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><th>Child Information</th></tr>
<tr><td>Name</td></tr>
<tr><td>Johnny Driscol</td></tr>`);
  });

  it('should format Contact Info Options data', function() {
    let result = emailLayout.contact(sampleRequestData.contactInfoOptions);
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><td>Phone (primary)</td></tr>
<tr><td>7785550628</td></tr>
<tr><td>Phone (secondary)</td></tr>
<tr><td>+1 077865552824</td></tr>
<tr><td>Email</td></tr>
<tr><td><a href="mailto:homer@springfield.com" target="_blank">homer@springfield.com</a></td></tr>
<tr><td>Address</td></tr>
<tr><td>108-2260 Maple Ave N.</td></tr>
<tr><td>City</td></tr>
<tr><td>Sooke</td></tr>
<tr><td>Postal/Zip Code</td></tr>
<tr><td>V9Z 1L2</td></tr>
<tr><td>Province</td></tr>
<tr><td>British Columbia</td></tr>
<tr><td>Country</td></tr>
<tr><td>Canada</td></tr>`);
  });

  it('should format minimal Contact Info Options data', function() {
    let result = emailLayout.contact({
      phonePrimary: '(778) 555-0628'
    });
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><td>Phone (primary)</td></tr>
<tr><td>(778) 555-0628</td></tr>`);
  });

  it('should format Select About data (myself-child-another)', function() {
    let result = emailLayout.about({
      yourself: true,
      child: true,
      another: true
    });
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><td>Requesting info about</td></tr>
<tr><td>Myself and A child under 12 and Another person</td></tr>`);
  });

  it('should format Select About data (myself-another)', function() {
    let result = emailLayout.about({
      yourself: true,
      child: false,
      another: true
    });
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><td>Requesting info about</td></tr>
<tr><td>Myself and Another person</td></tr>`);
  });

  it('should format Select About data (myself only)', function() {
    let result = emailLayout.about({
      yourself: true,
      child: false,
      another: null
    });
    result = scrubAttribs(result);
    expect(result).to.equal(`<tr><td>Requesting info about</td></tr>
<tr><td>Myself</td></tr>`);
  });

  it('should render a whole email, excluding child and another', function() {
    sinon.spy(emailLayout, 'general');
    sinon.spy(emailLayout, 'ministry');
    sinon.spy(emailLayout, 'personal');
    sinon.spy(emailLayout, 'anotherInformation');
    sinon.spy(emailLayout, 'childInformation');
    sinon.spy(emailLayout, 'contact');
    sinon.spy(emailLayout, 'about');

    const data = { requestData: sampleRequestData };
    emailLayout.renderEmail(data);

    expect(emailLayout.general.calledOnce).to.be.true;
    expect(emailLayout.general.getCall(0).args[0]).to.equal(
      sampleRequestData.descriptionTimeframe
    );

    expect(emailLayout.ministry.calledOnce).to.be.true;
    expect(emailLayout.ministry.getCall(0).args[0]).to.equal(
      sampleRequestData.ministry
    );

    expect(emailLayout.personal.calledOnce).to.be.true;
    expect(emailLayout.personal.getCall(0).args[0]).to.equal(
      sampleRequestData.contactInfo
    );

    // These were not called yet!
    expect(emailLayout.anotherInformation.calledOnce).to.be.false;
    expect(emailLayout.childInformation.calledOnce).to.be.false;

    expect(emailLayout.contact.calledOnce).to.be.true;
    expect(emailLayout.contact.getCall(0).args[0]).to.equal(
      sampleRequestData.contactInfoOptions
    );

    expect(emailLayout.about.calledOnce).to.be.true;
    expect(emailLayout.about.getCall(0).args[0]).to.equal(
      sampleRequestData.selectAbout
    );
  });

  it('should render a whole email, including child and another', function() {
    sinon.spy(emailLayout, 'anotherInformation');
    sinon.spy(emailLayout, 'childInformation');

    const data = { requestData: sampleRequestData };
    data.requestData.selectAbout = {
      yourself: true,
      child: true,
      another: true
    };
    emailLayout.renderEmail(data);

    expect(emailLayout.anotherInformation.calledOnce).to.be.true;
    expect(emailLayout.anotherInformation.getCall(0).args[0]).to.equal(
      sampleRequestData.anotherInformation
    );

    expect(emailLayout.childInformation.calledOnce).to.be.true;
    expect(emailLayout.childInformation.getCall(0).args[0]).to.equal(
      sampleRequestData.childInformation
    );
  });
});
