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

  function general(data) {
    let result = tableHeader('Request Records');
    if (data.topic) {
      result += tableRow('Topic', data.topic);
    }
    if (data.description) {
      result += tableRow('Description', data.description);
    }
    if (data.fromDate) {
        // TODO: nice date format!
      result += tableRow('From <small>(dd/mm/yyyy)</small>', data.fromDate);
    }
    if (data.toDate) {
      result += tableRow('To <small>(dd/mm/yyyy)</small>', data.toDate);
    }
    return result;
  }

  function ministry(data) {
    let result = tableHeader('Ministry or Agency');
    if (data.selectedMinistry && data.selectedMinistry.name) {
      result = tableRow('Ministry', data.selectedMinistry.name);
    } else if (data.default && data.default.name) {
      result = tableRow('Ministry', data.default.name);
    }
    return result;
  }

  function personal(data) {
    let result = tableHeader('Contact Information');
    result += tableRow(
      'Name',
      [data.firstName, data.middleName, data.lastName].join(' ')
    );
    if (data.businessName) {
      result += tableRow('Business Name', data.businessName);
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
      const anchor = `<a href="mailto:${data.email}" target="_blank">${data.email}</a>`;
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

  function delivery(data) {
    let result = '';
    if (data.deliveryType === 'other' && data.otherDetails) {
      result += tableRow('Delivery Method', data.otherDetails);
    } else {
      result += tableRow('Delivery Method', data.deliveryType);
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
      selected.push('Another Person');
    }
    if (selected.length > 0) {
      result += tableRow('Info about', selected.join(' and '));
    }
    return result;
  }

  function renderEmail(data) {
    let content = '';
    // Request Records
    content += general(data.requestData);
    content += delivery(data.requestData.contactInfoB || {});
    // Ministry or Agency
    content += ministry(data.requestData.ministry || {});
    // Contact Information
    content += personal(data.requestData.personalInfo || {});
    content += contact(data.requestData.contactInfoA || {});
    // ??
    content += about(data.requestData.selectAbout || {});
    content = table(content);
    // End of the Table

    // Stuff the JSON request ontp the email, for now.
    content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;

    return content;
  }

  return {
    table,
    tableHeader,
    tableRow,
    general,
    ministry,
    personal,
    contact,
    delivery,
    about,
    renderEmail
  };
})();
