/**
 * Keep the email layout functions together, outside of index.js
 */
module.exports = function EmailLayout() {
  this.table = function(rows) {
    return `<table width="95%" border="0" cellpadding="5" cellspacing="0"><tbody
          style="font-size:12px;font-family:sans-serif;background-color:#fff;"
    >${rows}</tbody></table>\n`;
  };

  this.tableHeader = function(label) {
    return `<tr><th style="font-size:14px;font-weight:bold;background-color:#eee;border-bottom:1px solid #dfdfdf;text-align:left;padding:7px 7px">${label}</th></tr>\n`;
  };

  this.tableRow = function(label, value) {
    return `<tr><td style="font-weight:bold;background-color:#eaf2fa;">${label}</td></tr>
            <tr><td style="padding-left:20px;">${value}</td></tr>\n`;
  };

  this.dateFormat = function(isoDateStr) {
    // HTML5 date is ALWAYS formatted yyyy-mm-dd.
    // ISO Date is ALWAYS formatted yyyy-mm-ddT00:00:00.000Z.
    let result = isoDateStr || 'n/a';
    if (isoDateStr){
      const dt = new Date(isoDateStr);
      if (!Number.isNaN(dt.getTime())) {
        const year = dt.getFullYear();
        let month = dt.getMonth() + 1;
        let day = dt.getDate();

        // Dates should look like 01/03/2019 rather than 1/3/2019.
        // Dates should look like 01/23/2019 rather than 1/23/2019.
        month = (`0${month}`).slice(-2);
        day = (`0${day}`).slice(-2);

        result = `${month}/${day}/${year}`;
      }
    }
    return result;
  };

  this.joinBySpace = function(...strArr) {
    return strArr
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  this.getAuthorisedDetailsTable = function (data) {
    let result =''
    result += this.tableRow('Given Names of requestor', data.firstName);
    result += this.tableRow('Last Name of requestor', data.lastName);
    const anchor = `<a href="mailto:${data.email}" target="_blank">${
      data.email
    }</a>`;
    result += this.tableRow('Email  of requestor', anchor);
    // DOB no longer comes from BCSC
    //result += this.tableRow('Date Of Birth of the Submitter', data.birthDate);
    return result
  }
  this.general = function(data) {
    let result = this.tableHeader('Request Description');
    // Removed Topic from the generated email body.
    // if (data.topic) {
    //   result += this.tableRow('Topic', data.topic);
    // }
    if (data.description) {
      // Replace all the newline chars with html line breaks!
      const fmtDescription = (data.description || 'undefined').replace(
        /\n/g,
        '<br>'
      );
      result += this.tableRow('Description', fmtDescription);
    }
    if (data.fromDate) {
      result += this.tableRow(
        'From <small>(mm/dd/yyyy)</small>',
        this.dateFormat(data.fromDate)
      );
    }
    if (data.toDate) {
      result += this.tableRow(
        'To <small>(mm/dd/yyyy)</small>',
        this.dateFormat(data.toDate)
      );
    }
    if (data.publicServiceEmployeeNumber) {
      result += this.tableRow(
        'Public Service Employee Number',
        data.publicServiceEmployeeNumber
      );
    }
    if (data.correctionalServiceNumber) {
      result += this.tableRow(
        'Correctional Service Number',
        data.correctionalServiceNumber
      );
    }
    return result;
  };

  this.ministry = function(data) {
    let result = this.tableHeader('Ministry or Agency');

    let ministryContent = '';
    if (data.selectedMinistry) {
      for (let i = 0; i < data.selectedMinistry.length; i++) {
        let ministry = data.selectedMinistry[i];
        if (i > 0) {
          ministryContent += '<br>';
        }
        ministryContent += ministry.name;
      }
      result += this.tableRow('Ministry', ministryContent);
    } else if (data.defaultMinistry && data.defaultMinistry.name) {
      result += this.tableRow('Ministry', data.defaultMinistry.name);
    }

    return result;
  };

  this.personal = function(data ,isAuthorised) {
    // if isAuthorised , dont print the firstName and LastName
    let result = this.tableHeader('Contact Information');
    if (!isAuthorised) {
      result += this.tableRow(
        'Name',
        this.joinBySpace(data.firstName, data.middleName, data.lastName)
      );
    } else if (data.middleName) {
      result += this.tableRow(
        'Middle Name',
        this.joinBySpace(data.middleName)
      );
    }
    if (data.alsoKnownAs) {
      result += this.tableRow('Also Known As', data.alsoKnownAs);
    }
    if (data.businessName) {
      result += this.tableRow('Business Name', data.businessName);
    }
    if (data.birthDate) {
      result += this.tableRow('Birth Date <small>(mm/dd/yyyy)</small>', this.dateFormat(data.birthDate));
    }
    return result;
  };

  this.anotherInformation = function(data) {
    let result = this.tableHeader('Another Person Information');
    result += this.tableRow(
      'Name',
      this.joinBySpace(data.firstName, data.middleName, data.lastName)
    );
    if (data.alsoKnownAs) {
      result += this.tableRow('Also Known As', data.alsoKnownAs);
    }
    if (data.dateOfBirth) {
      result += this.tableRow('Date of Birth <small>(mm/dd/yyyy)</small>', this.dateFormat(data.dateOfBirth));
    }
    return result;
  };

  this.childInformation = function(data) {
    let result = this.tableHeader('Child Information');
    result += this.tableRow(
      'Name',
      this.joinBySpace(data.firstName, data.middleName, data.lastName)
    );
    if (data.alsoKnownAs) {
      result += this.tableRow('Also Known As', data.alsoKnownAs);
    }
    if (data.dateOfBirth) {
      result += this.tableRow('Date of Birth <small>(mm/dd/yyyy)</small>', this.dateFormat(data.dateOfBirth));
    }
    return result;
  };

  this.adoptiveParents = function(data) {
    const mother = this.joinBySpace(data.motherFirstName, data.motherLastName);
    const father = this.joinBySpace(data.fatherFirstName, data.fatherLastName);
    let result = '';
    if (mother || father) {
      result += this.tableHeader('Adoptive Parents');
      result += this.tableRow('Adoptive Mother', mother || 'None');
      result += this.tableRow('Adoptive Father', father || 'None');
    }
    return result;
  };

  this.contact = function(data , isAuthorised) {
    let result = '';
    if (data.phonePrimary) {
      result += this.tableRow('Phone (primary)', data.phonePrimary);
    }
    if (data.phoneSecondary) {
      result += this.tableRow('Phone (secondary)', data.phoneSecondary);
    }
    if (data.email && !isAuthorised) {
      const anchor = `<a href="mailto:${data.email}" target="_blank">${
        data.email
      }</a>`;
      result += this.tableRow('Email', anchor);
    }
    if (data.address) {
      result += this.tableRow('Address', data.address);
    }
    if (data.city) {
      result += this.tableRow('City', data.city);
    }
    if (data.postal) {
      result += this.tableRow('Postal/Zip Code', data.postal);
    }
    if (data.province) {
      result += this.tableRow('Province', data.province);
    }
    if (data.country) {
      result += this.tableRow('Country', data.country);
    }
    return result;
  };

  this.about = function(data) {
    let result = '';
    let selected = [];
    if (data.yourself) {
      selected.push('Myself');
    }
    if (data.child) {
      selected.push('A child under 12');
    }
    if (data.another) {
      selected.push('Another person');
    }
    if (selected.length > 0) {
      result += this.tableRow('Requesting info about', selected.join(' and '));
    }
    return result;
  };

  this.requestInformation = function(data) {
    let result = this.tableHeader('Request Information');
    result += this.tableRow(
      'Request id',
      data.requestId
    );

    return result;
  };

  this.paymentInformation = function(data) {
    let result = this.tableHeader('Payment Information');

    if (data.transactionNumber) {
      result += this.tableRow('Transaction number', data.transactionNumber);
    }
    if (data.transactionOrderId) {
      result += this.tableRow('Transaction order id', data.transactionOrderId);
    }
    if (data.amount) {
      result += this.tableRow('Amount', `$${data.amount}`);
    }
    return result;
  };

  this.renderEmail = function(data ,isAuthorised , authorisedDetails) {
    let content = this.tableHeader('Request Records');
      this.table()
    if (isAuthorised) {
      content += this.tableRow(
        'Requestor identity verification','BC Services Card'
      );

      content += this.tableRow(
       'Verified details',this.table(this.getAuthorisedDetailsTable(authorisedDetails))
      );

    }
    content += this.tableRow(
      'Request Type',
      data.requestData.requestType.requestType
    );
    // Request is About
    data.requestData.selectAbout = data.requestData.selectAbout || {};
    content += this.about(data.requestData.selectAbout || {});
    // if we have 'anotherInformation' then include the block
    if (data.requestData.selectAbout.another) {
      content += this.anotherInformation(
        data.requestData.anotherInformation || {}
      );
    }
    // if we have 'childInformation' then include the block
    if (data.requestData.selectAbout.child) {
      content += this.childInformation(data.requestData.childInformation || {});
    }
    // Request Records
    content += this.general(data.requestData.descriptionTimeframe || {});
    // Ministry or Agency
    content += this.ministry(data.requestData.ministry || {});
    // Contact Information
    content += this.personal(data.requestData.contactInfo || {} ,isAuthorised);
    content += this.contact(data.requestData.contactInfoOptions || {},isAuthorised);
    // Adoptive Parents
    content += this.adoptiveParents(data.requestData.adoptiveParents || {});
    // Request info
    if(data.requestData.requestId) {
      content += this.requestInformation({
        requestId: data.requestData.requestId
      })
    }
    // Payment info
    if(data.requestData.paymentInfo) {
      content += this.paymentInformation(data.requestData.paymentInfo);
    }

    // Simple footer
    content += this.tableHeader(`Submitted ${new Date().toString()}`);
    content = this.table(content);
    // End of the Table

    // Include raw JSON in the email, for local instances only.
    if (!process.env.OPENSHIFT_BUILD_NAME) {
      content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    return content;
  };
};
