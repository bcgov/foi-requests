/**
 * Keep the email layout functions together, outside of index.js
 */
module.exports = (function() {
  function table(rows) {
    return `<table width="95%" border="0" cellpadding="5" cellspacing="0"><tbody
          style="font-size:12px;font-family:sans-serif;background-color:#fff;"
    >${rows}</tbody></table>\n`;
  }

  function tableHeader(label) {
    return `<tr><th style="font-size:14px;font-weight:bold;background-color:#eee;border-bottom:1px solid #dfdfdf;text-align:left;padding:7px 7px">${label}</th></tr>\n`;
  }

  function tableRow(label, value) {
    return `<tr><td style="font-weight:bold;background-color:#eaf2fa;">${label}</td></tr>
            <tr><td style="padding-left:20px;">${value}</td></tr>\n`;
  }

  function dateFormat(html5Date) {
    // HTML5 date is ALWAYS formatted yyyy-mm-dd.
    let result = html5Date || 'n/a';
    if (result.split('-').length === 3) {
      const parts = result.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      result = `${day}/${month}/${year}`;
    }
    return result;
  }

  function general(data) {
    let result = tableHeader('Request Description');
    if (data.topic) {
      result += tableRow('Topic', data.topic);
    }
    if (data.description) {
      // Replace all the newline chars with html line breaks!
      const fmtDescription = (data.description || 'undefined').replace(
        /\n/g,
        '<br>'
      );
      result += tableRow('Description', fmtDescription);
    }
    if (data.fromDate) {
      result += tableRow(
        'From <small>(dd/mm/yyyy)</small>',
        dateFormat(data.fromDate)
      );
    }
    if (data.toDate) {
      result += tableRow(
        'To <small>(dd/mm/yyyy)</small>',
        dateFormat(data.toDate)
      );
    }
    if (data.publicServiceEmployeeNumber) {
      result += tableRow(
        'Public Service Employee Number',
        dateFormat(data.publicServiceEmployeeNumber)
      );
    }
    if (data.correctionalServiceNumber) {
      result += tableRow(
        'Correctional Service Number',
        dateFormat(data.correctionalServiceNumber)
      );
    }
    return result;
  }

  function ministry(data) {
    let result = tableHeader('Ministry or Agency');

    let ministryContent = '';
    if (data.selectedMinistry) {
      for (let i = 0; i < data.selectedMinistry.length; i++) {
        let ministry = data.selectedMinistry[i];
        if (i > 0) {
          ministryContent += '<br>';
        }
        ministryContent += ministry.name;
      }
      result += tableRow('Ministry', ministryContent);
    } else if (data.defaultMinistry && data.defaultMinistry.name) {
      result += tableRow('Ministry', data.defaultMinistry.name);
    }

    return result;
  }

  function personal(data) {
    let result = tableHeader('Contact Information');
    result += tableRow(
      'Name',
      [data.firstName, data.middleName, data.lastName].join(' ')
    );
    if (data.alsoKnownAs) {
      result += tableRow('Also Known As', data.alsoKnownAs);
    }
    if (data.businessName) {
      result += tableRow('Business Name', data.businessName);
    }
    return result;
  }

  function anotherInformation(data) {
    let result = tableHeader('Another Person Information');
    result += tableRow(
      'Name',
      [data.firstName, data.middleName, data.lastName].join(' ')
    );
    if (data.alsoKnownAs) {
      result += tableRow(
        'Also Known As',
        data.alsoKnownAs
      )
    }
    if (data.dateOfBirth) {
      result += tableRow('Date of Birth', data.dateOfBirth);
    }
    return result;
  }

  function childInformation(data) {
    let result = tableHeader('Child Information');
    result += tableRow(
      'Name',
      [data.firstName, data.middleName, data.lastName].join(' ')
    );
    if (data.alsoKnownAs) {
      result += tableRow(
        'Also Known As',
        data.alsoKnownAs
      )
    }
    if (data.dateOfBirth) {
      result += tableRow('Date of Birth', data.dateOfBirth);
    }
    return result;
  }

  function adoptiveParents(data) {
    const mother = [data.motherFirstName, data.motherLastName].join(' ').trim();
    const father = [data.fatherFirstName, data.fatherLastName].join(' ').trim();
    let result = '';
    if (mother || father) {
      result += tableHeader('Adoptive Parents');
      result += tableRow('Adoptive Mother', mother);
      result += tableRow('Adoptive Father', father);
    }
    return result;
  }

  function contact(data) {
    let result = '';
    if (data.phonePrimary) {
      result += tableRow('Phone (primary)', data.phonePrimary);
    }
    if (data.phoneSecondary) {
      result += tableRow('Phone (secondary)', data.phoneSecondary);
    }
    if (data.email) {
      const anchor = `<a href="mailto:${data.email}" target="_blank">${
        data.email
      }</a>`;
      result += tableRow('Email', anchor);
    }
    if (data.address) {
      result += tableRow('Address', data.address);
    }
    if (data.city) {
      result += tableRow('City', data.city);
    }
    if (data.postal) {
      result += tableRow('Postal/Zip Code', data.postal);
    }
    if (data.province) {
      result += tableRow('Province', data.province);
    }
    if (data.country) {
      result += tableRow('Country', data.country);
    }
    return result;
  }

  function about(data) {
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
      result += tableRow('Requesting info about', selected.join(' and '));
    }
    return result;
  }

  function renderEmail(data) {
    let content = tableHeader('Request Records');
    content += tableRow('Request Type', data.requestData.requestType.requestType);
    // Request is About
    data.requestData.selectAbout = data.requestData.selectAbout || {};
    content += about(data.requestData.selectAbout || {});
    // if we have 'anotherInformation' then include the block
    if (data.requestData.selectAbout.another){
      content += anotherInformation(data.requestData.anotherInformation || {});
    }
    // if we have 'childInformation' then include the block
    if (data.requestData.selectAbout.child){
      content += childInformation(data.requestData.childInformation || {});
    }
    // Request Records
    content += general(data.requestData.descriptionTimeframe || {});
    // Ministry or Agency
    content += ministry(data.requestData.ministry || {});
    // Contact Information
    content += personal(data.requestData.contactInfo || {});
    content += contact(data.requestData.contactInfoOptions || {});
    // Adoptive Parents
    content += adoptiveParents(data.requestData.adoptiveParents || {});
    // Simple footer
    content += tableHeader(`Submitted ${new Date().toString()}`);
    content = table(content);
    // End of the Table

    // Include raw JSON in the email, for non-production instances.
    if (process.env.NODE_ENV !== 'PROD') {
      content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    return content;
  }

  return {
    table,
    tableHeader,
    tableRow,
    dateFormat, 
    general,
    ministry,
    personal,
    contact,
    about,
    renderEmail
  };
})();
