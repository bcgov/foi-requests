/* Submit FOI Request
 *  1. Save raw request data to DB
 *  2. Send email with request details
*/

'use strict';
const fs = require('fs');
const {EmailLayout, ConfirmationEmailLayout, ApplicantEmailLayout} = require('./emailLayout');
const restifyErrors = require('restify-errors');
const { RequestAPI } = require('./foiRequestApiService');
const foiRequestAPIBackend = process.env.FOI_REQUEST_API_BACKEND;
const foiRequestInbox = process.env.FOI_REQUEST_INBOX;
const requestAPI = new RequestAPI();
const MAX_ATTACH_MB = 5;
const maxAttachBytes = MAX_ATTACH_MB * 1024 * 1024;

const submitFoiRequest = async (server, req, res, next) => {
  console.log(
    '[API]',
    new Date().toISOString(),
    'submitFoiRequest API called'
  );
  console.trace('submitFoiRequest API');
  
  const apiUrl = `${foiRequestAPIBackend}/foirawrequests`;  

  req.params.requestData = JSON.parse(req.params.requestData);
  
  req.params.requestData.isPIIRedacted = false;

  const data = {
    envMessage: process.env.NODE_ENV,
    params: {
      ...req.params,
      requestData: req.params.requestData,
    },
    files: req.files,
  };

  if (req.files) {
    data.params["requestData"].Attachments = convertFilesToBase64(
      req.files,
      maxAttachBytes,
      next
    );
  }
  
  const requestAttachmentHTML = new EmailLayout().renderEmail(req.params ,req.isAuthorised, req.userDetails);
  const requestAttachment = await generatePDFFromHTML(requestAttachmentHTML);
  if (requestAttachment) {
    console.log("LARGE FILE?:", Buffer.from(requestAttachment).length > maxAttachBytes);
    const attachmentObj = {
      "filename": "RequestReceipt.pdf",
      "base64data": Buffer.from(requestAttachment).toString("base64"),
    };
    data.params["requestData"].Attachments = data.params["requestData"].Attachments ?  data.params["requestData"].Attachments.push(attachmentObj) : [attachmentObj];
  }
  
  try {

    const needsPayment = doesNeedPayment(req);
    data.params.requestData.requiresPayment = needsPayment  

    console.log("calling RAW FOI Request");
    const response =  await requestAPI.invokeRequestAPI(JSON.stringify(data.params), apiUrl);
  
    console.log(`API response = DATA: ${JSON.stringify(response.data)}, STATUS: ${response.status}`);

    if(response.status === 200  && response.data.status) {
      console.log(`response id: ${response.data.id}`);
      // if request needs payment, return earlier to prevent sending email as it will be sent after payment.
      if(needsPayment) {
        req.log.info('Success:', response.data.message);
        res.send({ result: 'success', id: response.data.id, pendingPayment: true });
        return next();
      }
      
      console.log(`Sending message to ${foiRequestInbox}`);
      req.log.info(`Sending message to ${foiRequestInbox}`);
      await sendSubmissionEmail(req, next, server);
      
      const applicantEmail = req.params.requestData?.contactInfoOptions?.email;
      let applicantResponse = { "EmailSuccess": "N/A", "message": "N/A" };
      if (applicantEmail) {
        const applicantEmailAttachments = convertAndCreateBase64AttachmentArr([requestAttachment]);
        applicantResponse = await sendApplicantEmail(req, server, applicantEmail, applicantEmailAttachments);
      }

      res.send({
        EmailSuccess: true, 
        message: 'success',
        pendingPayment: false,
        ApplicantEmailSuccess: applicantResponse.EmailSuccess,
        ApplicantEmailMessage: applicantResponse.message,
      });

    } else {
      req.log.info('Failed:', response);
      const unavailable = new restifyErrors.ServiceUnavailableError('Service is unavailable.');
      return next(unavailable);
    }  
  }
   catch(error) {
    console.log(`${error}`);
    console.log("FOI API STATUS:", error.response?.status);
    console.log("FOI API DATA:", error.response?.data);
    req.log.info('Failed:', error);
    let unavailable = "";
    if (error.response?.status === 409) {
      // Handle duplicate request
      unavailable = new restifyErrors.ConflictError(error.response.data.message);
    } else {
      unavailable = new restifyErrors.ServiceUnavailableError(error.message || 'Service is unavailable.');
    }
    return next(unavailable);
   }
}

const submitFoiRequestEmail = async (server, req, res, next) => {
  console.log(
    '[API]',
    new Date().toISOString(),
    'submitFoiRequestEmail API called'
  );
  console.trace('submitFoiRequestEmail API');

  req.params.requestData = JSON.parse(req.params.requestData);
  
  try {

    const receipt = [];

    try{
    const receiptResponse = await postGenerateReceipt({
      requestData: req.params.requestData,
      requestId: req.params.requestData.requestId,
      paymentId: req.params.requestData.paymentInfo.paymentId,
    });

    if(receiptResponse.status === 200 && receiptResponse.data) {
      var base64String = Buffer.from(receiptResponse.data).toString("base64");
  
      const receiptAttachement = {
        content: base64String,
        filename: "Receipt.pdf",
        encoding: "base64"
      };

      receipt.push(receiptAttachement)

    }
  }
  catch(genreceipterror){
    console.log("---submitFoiRequestEmail Generate Receipt Error starts--");
    console.log(genreceipterror);
    req.log.info('Generate receipt Error:', genreceipterror);
    console.log("---submitFoiRequestEmail Generate Receipt Error ends--");
  }
    req.log.info(`Sending message to ${foiRequestInbox}`, req.params);
    await sendSubmissionEmail(req, next, server, receipt);
    const confirmationResponse = await sendConfirmationEmail(
      req,
      server,
      receipt
    );

    const applicantEmail = req.params.requestData?.contactInfoOptions?.email;
    let applicantResponse = { "EmailSuccess": "N/A", "message": "N/A" };
    if (applicantEmail) {
      const requestReceiptHTML = new EmailLayout().renderEmail(req.params ,req.isAuthorised, req.userDetails);
      const requestReceipt = await generatePDFFromHTML(requestReceiptHTML);
      const applicantEmailAttachments = convertAndCreateBase64AttachmentArr([requestReceipt]);
      applicantResponse = await sendApplicantEmail(req, server, applicantEmail, applicantEmailAttachments);
    }
         
    req.log.info('FOI Request email submission success');

    res.send({
      EmailSuccess: true, 
      message: 'success', 
      ConfirmationEmailSuccess: confirmationResponse.EmailSuccess, 
      ConfirmationEmailMessage: confirmationResponse.message,
      ApplicantEmailSuccess: applicantResponse.EmailSuccess,
      ApplicantEmailMessage: applicantResponse.message
    });

    next();

  } catch(error) {
     console.log(`${error}`);
     req.log.info('Failed:', error);
     const unavailable = new restifyErrors.InternalServerError(error.message || 'Service is unavailable.');
     return next(unavailable);
   }
}

const sendSubmissionEmail = async (req, next, server, extraAttachements = []) => {
  let foiAttachments = getAttachments(req.files, maxAttachBytes, next);

  if (extraAttachements.length > 0) {
    foiAttachments = [...foiAttachments, ...extraAttachements];
  }

  const submissionEmailLayout = new EmailLayout();
  const submissionHtml = submissionEmailLayout.renderEmail(req.params ,req.isAuthorised, req.userDetails)
  const response = await sendEmail(submissionHtml, foiAttachments, server, foiRequestInbox, 'FOI Request Submission', req);

  if(!response.EmailSuccess) {
    throw Error('Submission email failed')
  }
  
  return response;

}

const sendApplicantEmail = async (req, server, applicantEmail, attachments) => {
  try {
    console.log(`Sending message to ${applicantEmail}`);
    const emailLayout = new ApplicantEmailLayout();
    const response = await sendEmail(emailLayout.renderEmail(), attachments, server, applicantEmail, "Receipt of FOI Request", req);

    return response;
  } catch (e) {
    console.error("Error in sending applicant email:", e);
    return { EmailSuccess: false, message: "Failed to send applicant email" } 
  }
}

const generatePDFFromHTML = async (html) => {
  try {
    const apiURL = `${foiRequestAPIBackend}/foirawrequest/requestreceipt`;
    const data = {
      "requestHTML": html
    };
    const response = await requestAPI.invokeGenerateRequestPDF(JSON.stringify(data), apiURL);
    
    if (response.status !== 200) {
      throw Error("Error in generating request receipt pdf");
    }

    const pdfBytes = response.data;
    return pdfBytes;
  } catch(e) {
    console.error(e.response);
  }
}

const sendConfirmationEmail = async (req, server, attachmets = []) => {
  try {
    const requestData = req.params.requestData
    const userEmail = requestData.contactInfoOptions.email
  
    if(!userEmail) {
      return { success: true }
    }
    const comfirmationEmailLayout = new ConfirmationEmailLayout();
    const confirmationHtml = comfirmationEmailLayout.renderEmail(requestData)
    const response = await sendEmail(
      confirmationHtml,
      attachmets,
      server,
      userEmail,
      "FOI Request Confirmation",
      req
    );
    
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

const postGenerateReceipt = ({requestData, requestId, paymentId}) => {
  
    const receiptData = formReceiptData(requestData);

    const apiUrl = `${foiRequestAPIBackend}/foirawrequests/${requestId}/payments/${paymentId}/receipt`;

    return requestAPI.invokeGenerateReceipt(
      JSON.stringify(receiptData),
      apiUrl
    );
}

const generateReceipt = (server, req, res, next) => {
  try {
    const { requestId, requestData, paymentId } = req.params;

    postGenerateReceipt({requestData, requestId, paymentId})
      .then(
        (response) => {
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

        const unavailable = new restifyErrors.ServiceUnavailableError(error);
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
  const result = {
    EmailSuccess: null,
    message: ""
  };
  const transomMailer = server.registry.get('transomSmtp');
  const emailConfig = {
    subject: subject,
    to: inbox,
    html: foiHtml,
    attachments: foiAttachments,
  };
  const maxtransomSmtRetries = 10;

  for (let transomSmtpAttempts = 1; transomSmtpAttempts <= maxtransomSmtRetries; transomSmtpAttempts++) {
    try {
      console.log(`Send email attempt ${transomSmtpAttempts} of ${maxtransomSmtRetries}`);

      const response = await new Promise((resolve, reject) => {
        transomMailer.sendEmail(emailConfig, (err, response) => {
          if (err) reject(err);
          result.message = "Email \"" + subject + "\" Sent Successfully";
          result.EmailSuccess = true;
          req.log.info('EmailSent:', response);
          resolve(response);
        })
      });
      console.log("BANG", response);
      
      // Delete all attachments on successfull submission.
      foiAttachments.map(file => {
        if(file.path) {
          fs.unlinkSync(file.path);
        }
      });

      return result;
    } catch(err) {
      if (transomSmtpAttempts === maxtransomSmtRetries) {
        console.error(`Max number of send email attempts reached. Email was not successfully sent: ${err}`);
        result.message = "Max number of send email attempts reached. Email was not successfully sent";
        // Fail open
        result.EmailSuccess = true;
        req.log.info('Failed:', err);
        return result; 
      }

      console.warn(`Email send attempt ${transomSmtpAttempts} failed: ${err}`);
      // Delay before retry
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}

const getAttachments = (files, maxFileSize, next) => {

  const attachments = [];
  if (files && Object.keys(files).length > 0) {
    Object.keys(files).map(f => {
      const file = files[f];
      if (file.size < maxFileSize) {

        attachments.push({
          filename: file.name,
          path: file.path
        });

      } else {
        const tooLarge = new restifyErrors.PayloadTooLargeError(`Attachment is too large! Max file size is ${maxFileSize} bytes.`);
        console.log('Attachment too large; size:', file.size, 'max:', maxFileSize);
        return next(tooLarge);
      }
    });
  }
  return attachments;
}

const convertFilesToBase64 = (files, maxFileSize, next) => {
  const attachments = [];
  if (files && Object.keys(files).length > 0) {
    Object.keys(files).map((f) => {
      const file = files[f];
      if (file.size < maxFileSize) {
        const filedata = fs.readFileSync(file.path, { encoding: "base64" });
        attachments.push({
          filename: file.name,
          base64data: filedata,
        });
      } else {
        const tooLarge = new restifyErrors.PayloadTooLargeError(
          `Attachment is too large! Max file size is ${maxFileSize} bytes.`
        );
        console.log(
          "Attachment too large; size:",
          file.size,
          "max:",
          maxFileSize
        );
        return next(tooLarge);
      }
    });
  }
  return attachments;
};

const doesNeedPayment = (req) => {
  const data = req.params.requestData

  if (!data.requestType) {
    throw new Error("Request type is missing")
  }

  if (!data.contactInfo) {
    throw new Error("Contant info is missing")
  }

  if (data.requestType.requestType === "general") {
    if(data.contactInfo.IGE) {
      return false
    }
    return true
  }
  else if (data.requestType.requestType === "personal") {
    return false
  }

  throw new Error("Invalid input data")
}

const convertAndCreateBase64AttachmentArr = (pdfFiles) => {
  const attachmentsArr = [];
  for (const pdf of pdfFiles) {
    if (pdf) {
      console.log("LARGE FILE?:", Buffer.from(pdf).length > maxAttachBytes);
      attachmentsArr.push({
        content: Buffer.from(pdf).toString("base64"),
        filename: "RequestDetails.pdf",
        encoding: "base64"
      });
    }
  }
  return attachmentsArr;
}

module.exports = {
  submitFoiRequest,
  submitFoiRequestEmail,
  getFeeDetails,
  createPayment,
  updatePayment,
  generateReceipt,
};
