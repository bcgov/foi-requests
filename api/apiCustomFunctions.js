/* Submit FOI Request
 *  1. Save raw request data to DB
 *  2. Send email with request details
*/

'use strict';
const fs = require('fs');
const {EmailLayout, ConfirmationEmailLayout} = require('./emailLayout');
const restifyErrors = require('restify-errors');
const { RequestAPI } = require('./foiRequestApiService');

const foiRequestAPIBackend = process.env.FOI_REQUEST_API_BACKEND;
const foiRequestInbox = process.env.FOI_REQUEST_INBOX;
const requestAPI = new RequestAPI();

const submitFoiRequest = async (server, req, res, next) => {
  
  const apiUrl = `${foiRequestAPIBackend}/foirawrequests`;  

  req.params.requestData = JSON.parse(req.params.requestData);
  const needsPayment = req.params.requestData.requestType && req.params.requestData.requestType.requestType === 'general';

  const data = {
    envMessage: process.env.NODE_ENV,
    params: req.params,
    files: req.files
  };
  
  
  try {
    console.log("calling RAW FOI Request");
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
      
      req.log.info(`Sending message to ${foiRequestInbox}`);  
      await sendSubmissionEmail(req, next, server);

      res.send({
        EmailSuccess: true, 
        message: 'success',
      });

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
     const unavailable = new restifyErrors.ServiceUnavailableError(error.message || 'Service is unavailable.');
     return next(unavailable);
   }
}

const submitFoiRequestEmail = async (server, req, res, next) => {

  req.params.requestData = JSON.parse(req.params.requestData);

  
  try {
    
    req.log.info(`Sending message to ${foiRequestInbox}`, req.params);
    await sendSubmissionEmail(req, next, server);
    const confirmationResponse = await sendConfirmationEmail(req, server)
         
    req.log.info('FOI Request email submission success');

    res.send({
      EmailSuccess: true, 
      message: 'success', 
      ConfirmationEmailSuccess: confirmationResponse.EmailSuccess, 
      ConfirmationEmailMessage: confirmationResponse.message
    });

    next();

  } catch(error) {
     console.log(`${error}`);
     req.log.info('Failed:', error);
     const unavailable = new restifyErrors.InternalServerError(error.message || 'Service is unavailable.');
     return next(unavailable);
   }
}

const sendSubmissionEmail = async (req, next, server) => {
  const MAX_ATTACH_MB = 5;
  const maxAttachBytes = MAX_ATTACH_MB * 1024 *1024;
  const foiAttachments = getAttachments(req.files, maxAttachBytes, next)

  const submissionEmailLayout = new EmailLayout();
  const submissionHtml = submissionEmailLayout.renderEmail(req.params ,req.isAuthorised, req.authorisedDetails)
  const response = await sendEmail(submissionHtml, foiAttachments, server, foiRequestInbox, 'FOI Request Submission', req);

  if(!response.EmailSuccess) {
    throw Error('Submission email failed')
  }
  
  return response;

}

const sendConfirmationEmail = async (req, server) => {
  try {
    const requestData = req.params.requestData
    const userEmail = requestData.contactInfoOptions.email
  
    if(!userEmail) {
      return { success: true }
    }
    const comfirmationEmailLayout = new ConfirmationEmailLayout();
    const confirmationHtml = comfirmationEmailLayout.renderEmail(requestData)
    const response = await sendEmail(confirmationHtml, [], server, userEmail, 'FOI Request Confirmation', req);
    
    return response;

  } catch(e) {

    return {EmailSuccess: false, message: "Failed to send confirmation email"}
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

const generateReceipt = (server, req, res, next) => {
  try {
    const { requestId, requestData, paymentId } = req.params;
    const receiptData = formReceiptData(requestData)
  
    const apiUrl = `${foiRequestAPIBackend}/foirawrequests/${requestId}/payments/${paymentId}/receipt`;
  
    requestAPI
      .invokeGenerateReceipt(JSON.stringify(receiptData), apiUrl)
      .then((response) => {
        [
          "Content-Disposition",
          "Content-Type",
          "Content-Length",
          "Content-Transfer-Encoding",
          "X-Report-Name",
        ].forEach((h) => {
          res.setHeader(h.toLowerCase(), response.headers[h.toLowerCase()]);
        });
        return res.end(response.data);
      })
      .catch((error) => {
        if (error.response) {
          return res.send(error.response.status, error.response.data);
        }

        const unavailable = new restifyErrors.ServiceUnavailableError(
          error
        );
        return next(unavailable);
      });;
      
  } catch(error) {
        const unavailable = new restifyErrors.ServiceUnavailableError(
          error
        );
        return next(unavailable);
  }
};

const formReceiptData = (requestData) => {
  const ministryMap = new Map();

  requestData.ministry.selectedMinistry.forEach((ministry) => {
    if (ministryMap.has(ministry.publicBody)) {
      ministryMap.get(ministry.publicBody).push(ministry.name);
    } else {
      ministryMap.set(ministry.publicBody, [ministry.name]);
    }
  });

  const receiptData = {
    selectedPublicBodies: Array.from(ministryMap).map(([key, value]) => {
      return {
        publicBody: key,
        ministry: value
          .filter((ministry) => ministry !== key)
          .map((ministry) => {
            return { name: ministry };
          }),
      };
    }),
    header: {
      firstName: requestData.contactInfo.firstName,
      lastName: requestData.contactInfo.lastName,
      dateSubmitted: requestData.paymentInfo.transactionDate
    },
    paymentInfo: {
      totalAmount: requestData.paymentInfo.amount,
      transactionNumber: requestData.paymentInfo.transactionNumber,
      transactionOrderId: requestData.paymentInfo.transactionOrderId,
      cardType: requestData.paymentInfo.cardType
    }
  };
  
  return receiptData;
};

const sendEmail = async (foiHtml, foiAttachments, server, inbox, subject, req) => {
  try {
    let pollingAttempts = 0;
    const result = {
      EmailSuccess: null,
      message: ""
    }
    const transomMailer = server.registry.get('transomSmtp');
    transomMailer.sendFromNoReply(
      {
        subject: subject,
        to: inbox,
        html: foiHtml,
        attachments: foiAttachments
      },
      async (err, response) => {
        // Delete all attachments on the submission.
        foiAttachments.map(file => {
          fs.unlinkSync(file.path);
        });
        // After files are deleted, process the result.
        // setTimeout(()=> {
          if (err) {
            result.message = err.message;
            result.EmailSuccess = false;
            req.log.info('Failed:', err);
          }
          else{
            result.message = "Email \"" + subject + "\" Sent Successfully";
            result.EmailSuccess = true;
            req.log.info('EmailSent:', response);
          }     
          console.log(`Sent Email? : ${result.EmailSuccess}, Message: ${result.message}`);
          // }, 500);
        });

        const executePoll = async (resolve, reject) => {
          pollingAttempts++;
          if (result.EmailSuccess !== null) {
            return resolve(result);
          } else if (pollingAttempts > 20) {
            return reject(new Error('Exceeded max attempts'));
          } else {
            setTimeout(executePoll, 300, resolve, reject);
          }
        };

        return new Promise(executePoll);
      } catch (e) {
    return {EmailSuccess: false, message: e}
  }
}

const omitSensitiveData = (requestData) => {
  delete requestData.descriptionTimeframe;
  delete requestData.contactInfo;
  delete requestData.contactInfoOptions;
  delete requestData.Attachments;
}

const getAttachments = (files, maxAttachBytes, next) => {

  const attachments = [];
  if (files && Object.keys(files).length > 0) {
    Object.keys(files).map(f => {
      const file = files[f];
      if (file.size < maxAttachBytes) {

        attachments.push({
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
  return attachments;
}

module.exports = {
  submitFoiRequest,
  submitFoiRequestEmail,
  getFeeDetails,
  createPayment,
  updatePayment,
  generateReceipt,
};