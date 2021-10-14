'use strict';
const fs = require('fs');
const EmailLayout = require('./emailLayout');
const restifyErrors = require('restify-errors');

function submitFoiRequest(server, req, res, next) {
  const transomMailer = server.registry.get('transomSmtp');
  const emailLayout = new EmailLayout();
  const foiRequestInbox = process.env.FOI_REQUEST_INBOX;

  const MAX_ATTACH_MB = 5;
  const maxAttachBytes = MAX_ATTACH_MB * 1024 *1024;

  req.params.requestData = JSON.parse(req.params.requestData);
  const needsPayment = req.params.requestData.requestType?.requestType === 'general'

  const data = {
    envMessage: process.env.NODE_ENV,
    params: req.params,
    files: req.files
  };
  req.log.info(`Sending message to ${foiRequestInbox}`, data);

  const foiHtml = emailLayout.renderEmail(data.params,req.isAuthorised,req.userDetails);
  const foiAttachments = [];
  if (req.files) {
    Object.keys(req.files).map(f => {
      const file = req.files[f];
      if (file.size < maxAttachBytes) {
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
  
  console.log("calling RAW FOI Request");
  if (req.files) {
    data.params["requestData"].Attachments = filesBase64;
  }
  try {
  const response =  await requestAPI.invokeRequestAPI(JSON.stringify(data.params), apiUrl);
 
  console.log(`API response = ${response.status}`);
  if(response.status === 200  && response.data.status ) {

    // if request needs payment, return earlier to prevent sending email as it will be sent after payment.
    if(needsPayment) {
      req.log.info('Success:', response.data.message);
      res.send({ result: 'success', id: response.data.id });
      return next();
    }

    const sentResponse = await sendEmail(foiHtml,foiAttachments);    
    
    if(sentResponse.EmailSuccess) {      
      req.log.info('Success:', response.data.message);
      res.send({ result: 'success', id: response.data.id });
      next();
    }
    else {
      console.log(sentResponse.message);
      const unavailable = new restifyErrors.ServiceUnavailableError(sentResponse.message || 'Service is unavailable.');
      return next(unavailable);
    }
   }
   else {
    req.log.info('Failed:', response);
    const unavailable = new restifyErrors.ServiceUnavailableError('Service is unavailable.');
    return next(unavailable);
   }  
  }
   catch(error){
     console.log(`${error}`);
     req.log.info('Failed:', error);
     const unavailable = new restifyErrors.ServiceUnavailableError('Service is unavailable.');
     return next(unavailable);
   }
}

const sendEmail = async (foiHtml, foiAttachments) => {
  var EmailSuccess = true;
  var message = "";
  const transomMailer = server.registry.get('transomSmtp');  
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
}

module.exports = { submitFoiRequest };
