'use strict';
const fs = require('fs');

function submitFoiRequest(server, req, res, next) {
  const transomMailer = server.registry.get('transomSmtp');
  const transomTemplate = server.registry.get('transomTemplate');
  const foiRequestInbox = process.env.FOI_REQUEST_INBOX;

  const MAX_ATTACH_MB = 4;
  const maxAttachMB = MAX_ATTACH_MB * 1000000;
  const data = {
    envMessage: process.env.NODE_ENV,
    params: req.params,
    files: req.files
  };
  console.log(`Sending message to ${foiRequestInbox}`);

  const foiAttachments = [];
  // Keep this for later!!!
  // Object.keys(req.files).map(f => {
  //   const file = req.files[f];
  //   if (file.size < maxAttachMB) {
  //     foiAttachments.push({
  //       filename: file.name,
  //       path: file.path
  //     });
  //   } else {
  //     // TODO: How to handle too many / too large?
  //     console.log('Attachment too large!', file);
  //   }
  // });
  transomMailer.sendFromNoReply(
    {
      subject: 'New FOI Request',
      to: foiRequestInbox,
      html: transomTemplate.renderEmailTemplate('foiRequest', data),
      attachments: foiAttachments
    },
    (err, response) => {
      // Delete all attachments on the submission.
      foiAttachments.map(file => {
        fs.unlinkSync(file.path);
      });
      // After files are deleted, process the result.
      if (err) {
        console.error('Failed:', err);
        return next(err);
      }
      console.log('Sent!', response);
      res.send({ result: 'success' });
      next();
    }
  );
}

module.exports = { submitFoiRequest };
