/* Submit FOI Request
 *  1. Save raw request data to DB
 *  2. Send email with request details
*/

'use strict';
const fs = require('fs');
const EmailLayout = require('./emailLayout');
const restifyErrors = require('restify-errors');
const { RequestAPI } = require('./foiRequestApiService');

const foiRequestAPIBackend = process.env.FOI_REQUEST_API_BACKEND;
const foiRequestInbox = process.env.FOI_REQUEST_INBOX;
const requestAPI = new RequestAPI();

const submitFoiRequest = async (server, req, res, next) => {
  
  const emailLayout = new EmailLayout();
  const MAX_ATTACH_MB = 5;
  const maxAttachBytes = MAX_ATTACH_MB * 1024 *1024;
  
  const apiUrl = `${foiRequestAPIBackend}/foirawrequests`;  

  req.params.requestData = JSON.parse(req.params.requestData);
  const needsPayment = req.params.requestData.requestType && req.params.requestData.requestType.requestType === 'general';

  const data = {
    envMessage: process.env.NODE_ENV,
    params: req.params,
    files: req.files
  };
  
  const foiHtml = emailLayout.renderEmail(data.params,req.isAuthorised,req.userDetails);
  const foiAttachments = getAttachments(req, maxAttachBytes, next);
  const filesBase64 = getFileBase64(req, maxAttachBytes, next);
  
  console.log("calling RAW FOI Request");
  if (req.files) {
    data.params["requestData"].Attachments = filesBase64;
  }
  try {
  omitSensitiveData(data.params.requestData)
  const response =  await requestAPI.invokeRequestAPI(JSON.stringify(data.params), apiUrl);
 
  console.log(`API response = ${response.status}`);
  if(response.status === 200  && response.data.status ) {

    // if request needs payment, return earlier to prevent sending email as it will be sent after payment.
    if(needsPayment) {
      req.log.info('Success:', response.data.message);
      res.send({ result: 'success', id: response.data.id });
      return next();
    }
    
    req.log.info(`Sending message to ${foiRequestInbox}`, data);  
    const sentResponse = await sendEmail(foiHtml,foiAttachments, server, foiRequestInbox);    
    
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

const submitFoiRequestEmail = async (server, req, res, next) => {
  
  const emailLayout = new EmailLayout();

  const MAX_ATTACH_MB = 5;
  const maxAttachBytes = MAX_ATTACH_MB * 1024 *1024;

  req.params.requestData = JSON.parse(req.params.requestData);

  req.log.info(`Sending message to ${foiRequestInbox}`, req.params);  
  
  const foiHtml = emailLayout.renderEmail(req.params,req.isAuthorised,req.userDetails);
  const foiAttachments = getAttachments(req, maxAttachBytes, next);  

  try {

    const sentResponse = await sendEmail(foiHtml,foiAttachments, server, foiRequestInbox);    
    
    if(sentResponse.EmailSuccess) {      
      req.log.info('FOI Request email submission success');
      res.send({EmailSuccess: true, message: 'success'});
      next();
    }
    else {
      console.log(sentResponse.message);
      const unavailable = new restifyErrors.ServiceUnavailableError(sentResponse.message || 'Service is unavailable.');
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

const getFeeDetails = (server, req, res, next) => {
  const apiUrl = `${foiRequestAPIBackend}/fees/${req.params.feeCode}?quantity=${req.params.quantity}`;
  requestAPI.invokeGetFeeDetails(apiUrl)
  .then(response => {
    return res.json(response.data);
  })
  .catch(error => {
    if(error.response) {
      return res.send(error.response.status, error.response.data)
    }

    req.log.info('Failed:', error);
    const unavailable = new restifyErrors.ServiceUnavailableError('Service is unavailable.');
    return next(unavailable);
  })
  
}

const createPayment = (server, req, res, next) => {
  const {requestId, requestData} = req.params;

  const apiUrl = `${foiRequestAPIBackend}/foirawrequests/${requestId}/payments`;
  requestAPI.invokeCreatePayment(JSON.stringify(requestData), apiUrl)
  .then(response => {
    return res.json(response.data);
  })
  .catch(error => {
    if(error.response) {
      return res.send(error.response.status, error.response.data)
    }
    
    req.log.info('Failed:', error);
    const unavailable = new restifyErrors.ServiceUnavailableError('Service is unavailable.');
    return next(unavailable);
  });  
}

const updatePayment = (server, req, res, next) => {
  const {requestId, requestData, paymentId} = req.params;

  const apiUrl = `${foiRequestAPIBackend}/foirawrequests/${requestId}/payments/${paymentId}`;

  requestAPI.invokeUpdatePayment(JSON.stringify(requestData), apiUrl)
  .then(response => {
    return res.json(response.data);
  })
  .catch(error => {
    if(error.response) {
      return res.send(error.response.status, error.response.data)
    }
    
    req.log.info('Failed:', error);
    const unavailable = new restifyErrors.ServiceUnavailableError('Service is unavailable.');
    return next(unavailable);
  });
}

const sendEmail = async (foiHtml, foiAttachments, server, inbox) => {
  var EmailSuccess = true;
  var message = "";
  const transomMailer = server.registry.get('transomSmtp');
  transomMailer.sendFromNoReply(
    {
      subject: 'New FOI Request',
      to: inbox,
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
          EmailSuccess = false;
          req.log.info('Failed:', err);
          message = err.message;          
        }
        else{
          EmailSuccess = true;         
          message = "Email Sent Successfully";
          req.log.info('EmailSent:', response);
        }        
      // }, 5000);
    });
    console.log(`Sent Email? : ${EmailSuccess}, Message: ${message}`);
    return { EmailSuccess, message };
}

const omitSensitiveData = (requestData) => {
  delete requestData.descriptionTimeframe;
  delete requestData.contactInfo;
  delete requestData.contactInfoOptions;
}

const getAttachments = (req, maxAttachBytes, next) => {

  const attachments = [];
  if (req.files) {
    Object.keys(req.files).map(f => {
      const file = req.files[f];
      if (file.size < maxAttachBytes) {

        attachments.push({
          filename: file.name,
          path: file.path
        });

        return attachments;
      } else {
        const tooLarge = new restifyErrors.PayloadTooLargeError(`Attachment is too large! Max file size is ${maxAttachBytes} bytes.`);
        console.log('Attachment too large; size:', file.size, 'max:', maxAttachBytes);
        return next(tooLarge);
      }
    });
  }
}

const getFileBase64 = (req, maxAttachBytes, next) => {

  const filesBase64 = [];
  if (req.files) {
    Object.keys(req.files).map(f => {
      const file = req.files[f];
      if (file.size < maxAttachBytes) {
        const filedata = fs.readFileSync(file.path, { encoding: 'base64' });

        filesBase64.push({
          filename: file.name,
          base64data: filedata
        });

        return filesBase64;
      } else {
        const tooLarge = new restifyErrors.PayloadTooLargeError(`Attachment is too large! Max file size is ${maxAttachBytes} bytes.`);
        console.log('Attachment too large; size:', file.size, 'max:', maxAttachBytes);
        return next(tooLarge);
      }
    });
  }
}

module.exports = { submitFoiRequest, submitFoiRequestEmail, getFeeDetails, createPayment, updatePayment};