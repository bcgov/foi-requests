const customFunctions = require('./apiCustomFunctions');
const apiCaptchaFx = require('./apiCaptcha');
const apiAuthFx = require('./apiAuth');
const captchaCfg = require('./captchaCfg');
const authCfg = require('./authCfg');
const apiCaptcha = apiCaptchaFx(captchaCfg);
const apiAuth = apiAuthFx(authCfg);
const RotatingFileStream = require('bunyan-rotating-file-stream');

module.exports = {
  note: 'This is a private server.',
  name: 'FOI REQUEST API',
  version: '0.0.1',
  transom: {
    cors: {
      origins: ['*']
    },
    requestLogger: {
      name: 'foirequestapi',
      streams: [
        {
          type: 'raw',
          stream: new RotatingFileStream({
            path: (process.env.LOG_PATH || '.') + '/foirequest.log',
            level: 'debug',
            period: '1d', // daily rotation
            totalFiles: 180, // keep 180 back copies
            rotateExisting: true, // Give ourselves a clean file when we start up, based on period
            threshold: '10m', // Rotate log files larger than 10 megabytes
            totalSize: '1500m', // Don't keep more than 1500mb of archived log files
            gzip: true // Compress the archive log files to save space
          })
        }
      ]
    }
  },

  definition: {
    uri: {
      prefix: '/api/v1'
    },
    // template: {
    //   emailTemplatePath: 'email-templates',
    //   htmlTemplatePath: 'page-templates',
    //   data: {
    //     processInfo: `Running on ${process.platform}, Process Id: ${
    //       process.pid
    //     }`
    //   }
    // },
    functions: {
      submitFoiRequest: {
        methods: ['POST'],
        preMiddleware: [apiAuth.verifyJWTResponseMiddleware, apiCaptcha.verifyJWTResponseMiddleware],
        function: customFunctions.submitFoiRequest
      },
      submitFoiRequestEmail: {
        methods: ['POST'],
        preMiddleware: [apiAuth.verifyJWTResponseMiddleware, apiCaptcha.verifyJWTResponseMiddleware],
        function: customFunctions.submitFoiRequestEmail
      },
      fees: {
        methods: ['GET'],
        function: customFunctions.getFeeDetails
      },
      createPayment: {
        methods: ['POST'],
        function: customFunctions.createPayment
      },
      updatePayment: {
        methods: ['POST'],
        function: customFunctions.updatePayment
      }
    }
  }
};
