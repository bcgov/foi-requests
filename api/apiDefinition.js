const customFunctions = require('./apiCustomFunctions');
const apiCaptchaFx = require('./apiCaptcha');
const apiCaptcha = apiCaptchaFx({foo:'bar'}); 
// const frontEndURI = process.env.FOI_REQUEST_UI || 'http://localhost:4200';
// const backEndURI = process.env.FOI_REQUEST_API || 'http://localhost:7085';

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
