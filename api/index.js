'use strict';

// Load the ENV configuration
require('dotenv').config();

const restifyErrors = require('restify-errors');
const Transom = require('@transomjs/transom-core');
const transomServerFunctions = require('@transomjs/transom-server-functions');
const transomSmtp = require('@transomjs/transom-smtp');

const apiDefinition = require('./apiDefinition');

const apiCaptchaFx = require('./apiCaptcha');
const captchaCfg = require('./captchaCfg');
const apiCaptcha = apiCaptchaFx(captchaCfg);

console.log(`Running ${apiDefinition.name} version ${apiDefinition.version}`);

const transom = new Transom();

// *****************************************************************
function isValidUser(req, res, next) {
  // Everyone is valid!
  next();
}

// *****************************************************************
transom.configure(transomServerFunctions, {
  preMiddleware: [isValidUser]
});

let smtpOptions;
if (process.env.FOI_REQUEST_SMTP) {
  smtpOptions = {
    host: process.env.FOI_REQUEST_SMTP,
    port: process.env.FOI_REQUEST_SMTP_PORT,
    secure: process.env.FOI_REQUEST_SMTP_SECURE == 'true' ? true : false,
    tls: {
      rejectUnauthorized: false
    }
  };
  if (process.env.SMTP_USERNAME) {
    smtpOptions.auth = {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    };
  }
} else {
  // More controlled option...
  smtpOptions = {
    host: process.env.SMTP_SERVER || 'smtp://localhost',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME || 'email@address.com',
      pass: process.env.SMTP_PASSWORD || 'my-secret-password'
    },
    tls: {
      rejectUnauthorized: false
    }
  };
}

// console.log('smtpOptions: ', smtpOptions);
console.log('build name: ', process.env.OPENSHIFT_BUILD_NAME || 'local');

transom.configure(transomSmtp, {
  smtp: smtpOptions,
  helpers: {
    noReply: process.env.FOI_REQUEST_SENDER
  }
});

// Initialize API metadata.
transom
  .initialize(apiDefinition)
  .then(function(server) {
    server.get('/', function(req, res, next) {
      res.send('FOI Request API Server');
      next();
    });

    server.use(function(req,res,next){
      req.log.info("(" + req.method + ")" + req.url);
      next();
    });

    // ************************************************************************
    // Handle Captcha routes
    // ************************************************************************
    server.post('/api/captcha', apiCaptcha.getCaptcha);
    server.post('/api/captcha/verify', apiCaptcha.verifyCaptcha);
    server.post('/api/captcha/audio', apiCaptcha.getCaptchaAudio);

    // ************************************************************************
    // Handle 404 errors when a route is undefined.
    // ************************************************************************
    server.get('/.*', function(req, res, next) {
      const err = new restifyErrors.NotFoundError(req.url + ' does not exist');
      next(err);
    });

    // ************************************************************************
    // Handle Errors within the app as our last middleware.
    // ************************************************************************
    server.use(function(error, req, res, next) {
      console.error('Error handler', error);
      const data = { error };
      res.statusCode = error.status || 501;
      res.send(data);
    });

    // ************************************************************************
    // Start the server.
    // ************************************************************************
    const port = process.env.PORT || process.env.FOI_REQUEST_API_PORT || 7077;
    console.log('Starting server on PORT', port);

    server.listen(port, () => {
      console.log('FOI Request API listening at %s', server.url);
    });
  })
  .catch(function(err) {
    console.log('Unable to start the server, exiting');
    console.error(err);
    process.exit(-1);
  });

// ************************************************************************
// Kill off the node process on interrupt.
// ************************************************************************
process.on('SIGINT', function() {
  console.log('API terminated by SIGINT!');
  process.exit(0);
});

// ************************************************************************
// Handle uncaught exceptions within your code.
// ************************************************************************
process.on('uncaughtException', function(err) {
  console.error('uncaughtException', err);
});

// ************************************************************************
// Handle uncaught rejections within your code.
// ************************************************************************
process.on('unhandledRejection', function(err) {
  console.error('unhandledRejection', err);
});
