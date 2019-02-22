const customFunctions = require('./apiCustomFunctions');
const apiCaptchaFx = require('./apiCaptcha');
const captchaCfg = require('./captchaCfg');
const apiCaptcha = apiCaptchaFx(captchaCfg); 

module.exports = {
  note: 'This is a private server.',
  name: 'FOI REQUEST API',
  version: '0.0.1',
  transom: {
    cors: {
      origins: ['*']
    }
  },
  definition: {
    uri: {
      prefix: '/api/v1'
    },
		template: {
			emailTemplatePath: 'email-templates',
			htmlTemplatePath: 'page-templates',
			data: {
				processInfo: `Running on ${process.platform}, Process Id: ${process.pid}`
			}
    },
    functions: {
      submitFoiRequest: {
          methods: ['POST'],
          preMiddleware: [apiCaptcha.verifyJWTResponseMiddleware],
          function: customFunctions.submitFoiRequest
        }
    }
  }
};
