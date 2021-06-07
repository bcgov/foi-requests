'use strict';
const fs = require('fs');
const EmailLayout = require('./emailLayout');
const restifyErrors = require('restify-errors');
const { RequestAPI } = require('./requestApiLayout');

function submitFoiRequest(server, req, res, next) {
  const transomMailer = server.registry.get('transomSmtp');
  const emailLayout = new EmailLayout();
  const foiRequestInbox = process.env.FOI_REQUEST_INBOX;

  const MAX_ATTACH_MB = 5;
  const maxAttachBytes = MAX_ATTACH_MB * 1024 *1024;

  const foiRequestAPIBackend = process.env.FOI_REQUEST_API_BACKEND;
  const apiUrl = `${foiRequestAPIBackend}/foirawrequests`;
  const requestAPI = new RequestAPI();

  req.params.requestData = JSON.parse(req.params.requestData);

  const data = {
    envMessage: process.env.NODE_ENV,
    params: req.params,
    files: req.files
  };
  req.log.info(`Sending message to ${foiRequestInbox}`, data);

  const foiHtml = emailLayout.renderEmail(data.params,req.isAuthorised,req.userDetails);
  const foiAttachments = [];
  const filesBase64 = [];
  if (req.files) {
    Object.keys(req.files).map(f => {
      const file = req.files[f];
      if (file.size < maxAttachBytes) {
        const filedata = fs.readFileSync(file.path, {encoding: 'base64'});
       
        filesBase64.push({
          filename:file.name,
          base64data:filedata
        });

        foiAttachments.push({
          filename: file.name,
          path: file.path
        });
      } else {
        const tooLarge = new restifyErrors.PayloadTooLargeError(`Attachment is too large! Max file size is ${maxAttachBytes} bytes.`);
        console.log('Attachment too large; size:', file.size, 'max:', maxAttachBytes);
        return next(tooLarge);
      }
    });
  }

  transomMailer.sendFromNoReply(
    {
      subject: 'New FOI Request',
      to: foiRequestInbox,
      html: foiHtml,
      attachments: foiAttachments
    },
    (err, response) => {
      // Delete all attachments on the submission.
      foiAttachments.map(file => {
        fs.unlinkSync(file.path);
      });
      // After files are deleted, process the result.
      // setTimeout(()=> {
        if (err) {
          req.log.info('Failed:', err);
          const unavailable = new restifyErrors.ServiceUnavailableError(err.message || 'Service is unavailable.');
          return next(unavailable);
        }
        req.log.info('Sent!', response);
        res.send({ result: 'success' });
        next();
      // }, 5000);
    }
  );
   //data.params["requestData"].Attachments = ["file.docx","TEST BASE64"];
   console.log("calling RAW FOI Request");
   if (req.files) {
     data.params["requestData"].Attachments = filesBase64;
   }
   console.log(`data.params = ${JSON.stringify(data.params)}`);  
   const apiRespose = requestAPI.invokeRequestAPI(JSON.stringify(data.params), apiUrl);
   console.log(`apiResponse = ${apiRespose}`);
}

module.exports = { submitFoiRequest };
