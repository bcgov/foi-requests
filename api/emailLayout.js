/**
 * Keep the email layout functions together, outside of index.js
 */
module.exports = (function() {

  function bold(text) {
    return `<b>${text}</b>`;
  }

  function table(rows) {
    return `<table border=1>${rows}</table>\n`;
  }

  function tableRow(label, value) {
    return `<tr><td>${label}</td></tr>\n<tr><td>${value}</td></tr>\n`;
  }

  function general(data) {
    let result = '';
    if (data.topic ) {
      result += tableRow('Topic', data.topic);
    }
    if (data.description ) {
      result += tableRow('Description', data.description);
    }
    if (data.fromDate ) {
      result += tableRow('From', data.fromDate);
    }
    if (data.toDate ) {
      result += tableRow('To', data.toDate);
    }
    return result;
  }

  function ministry(data) {
    let result = '';
    if (data.selectedMinistry && data.selectedMinistry.name) {
      result = tableRow('Ministry', data.selectedMinistry.name);
    } else if (data.default && data.default.name) {
      result = tableRow('Ministry', data.default.name);
    }
    return result;
  }

  function personal(data) {
    let result = '';
    result += tableRow('Name', [data.firstName, data.middleName, data.lastName].join(' '));
    if (data.businessName ) {
      result += tableRow('Business Name', data.businessName);
    }
    return result;
  }

  function contact(data) {
    let result = '';
    if (data.phonePrimary ) {
      result += tableRow('Phone (primary)', data.phonePrimary);
    }
    if (data.phoneSecondary ) {
      result += tableRow('Phone (secondary)', data.phoneSecondary);
    }
    if (data.email ) {
      result += tableRow('Email', data.email);
    }
    if (data.address ) {
      result += tableRow('Address', data.address);
    }
    if (data.city ) {
      result += tableRow('City', data.city);
    }
    if (data.postal ) {
      result += tableRow('Postal/Zip Code', data.postal);
    }
    if (data.province ) {
      result += tableRow('Province', data.province);
    }
    if (data.country ) {
      result += tableRow('Country', data.country);
    }
    return result;
  }

  function delivery(data) {
    let result = '';
    if (data.deliveryType === 'other' && data.otherDetails ) {
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
    content += general(data.requestData);
    content += ministry(data.requestData.ministry || {});
    content += personal(data.requestData.personalInfo || {});
    content += contact(data.requestData.contactInfoA || {});
    content += delivery(data.requestData.contactInfoB || {});
    content += about(data.requestData.selectAbout || {});
    content = table(content);
    // End of the Table

    // Stuff the JSON request ontp the email, for now.
    content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;

    return content;
  }

  return {
    bold,
    table,
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
