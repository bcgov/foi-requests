'use strict';

var svgCaptcha = require('svg-captcha');
var jwt = require('jsonwebtoken');

var text2wav = require('text2wav');
var arrayBufferToBuffer = require('arraybuffer-to-buffer');

function captchaInit(options) {

  const CAPTCHA_TOKEN_SECRET = options.CAPTCHA_TOKEN_SECRET || 'defaultSecret';
  const CAPTCHA_EXPIRY_MINUTES = options.CAPTCHA_EXPIRY_MINUTES || '15'; // In minutes
  const CAPTCHA_TOKEN_HEADER = options.CAPTCHA_TOKEN_HEADER || 'Authorization'; // the request header where we expect the jwt token
  const CAPTCHA_NONCE_HEADER = options.CAPTCHA_NONCE_HEADER || 'captcha-nonce'; // the request header where we expect the client nonce

  const voicePromptLanguageMap = {
    en: 'Please type in the following letters and numbers', // english
    fr: 'Veuillez saisir les lettres ou les chiffres suivants', // french
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਹੇਠ ਲਿਖੇ ਅੱਖਰ ਜਾਂ ਨੰਬਰ ਟਾਈਪ ਕਰੋ', // punjabi
    zh: '请输入以下英文字母或数字' // mandarin chinese
  };

  function encrypt(body) {
    var token = jwt.sign(body, CAPTCHA_TOKEN_SECRET, { expiresIn: '1400m' });
    return token;
  }

  function decrypt(encrypted) {
    var decrypted = jwt.verify(encrypted, CAPTCHA_TOKEN_SECRET);
    return decrypted;
  }

  function createCaptcha(nonce) {
    var captcha = svgCaptcha.create({
      size: 6, // size of random string
      ignoreChars: '0Oo1iIl', // filter out some characters like 0o1i
      noise: 2 // number of lines to insert for noise
    });

    // add answer, nonce and expiry to body
    var unEncryptedResponse = {
      nonce,
      answer: captcha.text
    };
    var validation = encrypt(unEncryptedResponse);
    delete captcha['text']; //this should not go to the front-end, defeats the purpose!!
    var fullReponse = {
      captcha,
      validation
    };

    return fullReponse;

  }

  function verifyCaptchaInternal(payload) {
    var answer = payload.answer;
    var nonce = payload.nonce;
    var validation = payload.validation;

    let decryptedBody;
    try {
      decryptedBody = decrypt(validation);
      if (decryptedBody !== null) {
        // Check answer
        if (decryptedBody.answer.toLowerCase() === answer.toLowerCase()) {
          if (decryptedBody.nonce === nonce) {
            // Passed the captcha test
            var token = jwt.sign({ data: { nonce: nonce } }, CAPTCHA_TOKEN_SECRET, {
              expiresIn: CAPTCHA_EXPIRY_MINUTES + 'm'
            });
            return { valid: true, jwt: token };
          } else {
            // incorrect nonce
            return { valid: false };
          }
        } else {
          // incorrect answer
          return { valid: false };
        }
      } else {
        // Bad decyption
        return { valid: false };
      }
    } catch (e) {
      console.log('Error decrypting validation: ', e);
      return { valid: false };
    }
  }

  function getAudio(body, req) {
    return new Promise(function (resolve, reject) {
      try {
        // pull out encrypted answer
        var validation = body.validation;

        // decrypt payload to get captcha text
        var decryptedBody = decrypt(validation);

        // Insert leading text and commas to slow down reader
        var captchaCharArray = decryptedBody.answer.toString().split('');
        let language = 'en';
        if (body.translation) {
          if (typeof body.translation == 'string') {
            if (voicePromptLanguageMap.hasOwnProperty(body.translation)) {
              language = body.translation;
            }
          } else if (
            body.translation === true &&
            req &&
            req.headers['accept-language']
          ) {
            let lang = req.headers['accept-language']
              .split(',')
              .map(e => e.split(';')[0].split('-')[0])
              .find(e => voicePromptLanguageMap.hasOwnProperty(e));
            if (lang) {
              language = lang;
            }
          }
        }
        var spokenCatpcha = voicePromptLanguageMap[language] + ': ';
        for (var i = 0; i < captchaCharArray.length; i++) {
          spokenCatpcha += captchaCharArray[i] + ', ';
        }
        getMp3DataUriFromText(spokenCatpcha, language).then(function (
          audioDataUri
        ) {
          if (!audioDataUri) {
            resolve({
              error: 'unknown'
            });
            return;
          }

          // Now pass back the full payload.
          resolve({
            audio: audioDataUri
          });
        });
      } catch (e) {
        console.log('Error getting audio:', e);
        resolve({
          error: 'unknown'
        });
      }
    });
  }
  ////////////////////////////////////////////////////////
  /*
   * Audio routines
   */
  ////////////////////////////////////////////////////////
  function getMp3DataUriFromText(text, language = 'en') {
    return text2wav(text, { voice: language })
      .then(function (audioArrayBuffer) {
        var audioBuffer = arrayBufferToBuffer(audioArrayBuffer);
        return 'data:audio/wav;base64,' + audioBuffer.toString('base64');
      })
      .catch(function (error) {
        console.log('Error generating audio CAPTCHA:', error);
        return null;
      });
  }

  function verifyJWTResponse(token, nonce) {
    try {
      var decoded = jwt.verify(token, CAPTCHA_TOKEN_SECRET);
      if (decoded.data && decoded.data.nonce === nonce) {
        return { valid: true };
      } else {
        return { valid: false };
      }
    } catch (e) {
      console.log(e)
      return { valid: false };
    }
  }

  return {
    getCaptcha: function (req, res, next) {
      var fullReponse = createCaptcha(req.body.nonce);
      res.send(fullReponse);
      next();
    },
    verifyCaptcha: function (req, res, next) {
      var ret = verifyCaptchaInternal(req.body);
      res.send(ret);
      next();
    },
    getCaptchaAudio: function (req, res, next) {
      getAudio(req.body, req).then(function (ret) {
        res.send(ret);
        next();
      });
    },
    verifyJWTResponseMiddleware: function (req, res, next) {
      // if there is a captcha header , it shud be validated by captcha verifier
      if (req.isAuthorised && req.userDetails && !req.headers[CAPTCHA_NONCE_HEADER]) {
        console.log('Request is already validated');
        return next();
      }

      var token = req.headers[CAPTCHA_TOKEN_HEADER.toLowerCase()] || '';
      token = token.replace('Bearer ', '');
      var nonce = req.headers[CAPTCHA_NONCE_HEADER];
      var ret = verifyJWTResponse(token, nonce); //TODO retrieve the nonce and pass it in
      if (ret.valid) {
        console.log('Captcha validated in apiCaptcha');
        next();
      } else {
        res.send(401, 'Not Authorized');
        next('Invalid Captcha Token');
      }
    }
  };
}

module.exports = captchaInit;
