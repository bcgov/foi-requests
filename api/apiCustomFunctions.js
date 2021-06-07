/* Submit FOI Request
 *  1. Save raw request data to DB
 *  2. Send email with request details
*/

'use strict';
const fs = require('fs');
const EmailLayout = require('./emailLayout');
const restifyErrors = require('restify-errors');
const { RequestAPI } = require('./foiRequestApiService');

const submitFoiRequest = async (server, req, res, next) => {
  
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
  
  console.log("calling RAW FOI Request");
  if (req.files) {
    data.params["requestData"].Attachments = filesBase64;
  }

  try {
  const response =  await requestAPI.invokeRequestAPI(JSON.stringify(data.params), apiUrl);
  
  console.log(`API response = ${response.status}`);
  if(response.status === 200  && response.data.status) {        

    var sentResponse = await sendEmail(foiHtml,foiAttachments);    
    
    if(sentResponse.EmailSuccess) {      
      req.log.info('Success:', response.data.message);
      res.send({ result: 'success' });
      next();
    }
    else {
      console.log(sentResponse.message);
      const unavailable = new restifyErrors.ServiceUnavailableError(sentResponse.message || 'Service is unavailable.');
      return next(unavailable);
    }
    // req.log.info('Success:', response.data.message);
    // res.send({ result: 'success' });
    // next();
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
    console.log(`bool : ${EmailSuccess}, errorMessage: ${errorMessage}`);
    return { EmailSuccess, message };
}
module.exports = { submitFoiRequest };
