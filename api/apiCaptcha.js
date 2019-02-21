'use strict';

var svgCaptcha = require('svg-captcha');
var jose = require('node-jose');
var jwt = require('jsonwebtoken')


var SECRET = process.env.SECRET || "defaultSecret";
var JWT_SIGN_EXPIRY = process.env.JWT_SIGN_EXPIRY || "15" // In minutes
var PRIVATE_KEY = process.env.PRIVATE_KEY
  ? JSON.parse(process.env.PRIVATE_KEY)
  : {
      kty: 'oct',
      kid: 'gBdaS-G8RLax2qObTD94w',
      use: 'enc',
      alg: 'A256GCM',
      k: 'FK3d8WvSRdxlUHs4Fs_xxYO3-6dCiUarBwiYNFw5hv8'
    };

var CAPTCHA_SIGN_EXPIRY = 15;

function encrypt(body) {
  let buff = Buffer.from(JSON.stringify(body));
  try {
    let cr = jose.JWE.createEncrypt(PRIVATE_KEY)
      .update(buff)
      .final();
    return cr;
  } catch (e) {
    throw e;
  }
}

function decrypt(body, private_key) {
  return new Promise(function(resolve, reject) {
    console.log(`to decrypt body: ` + JSON.stringify(body), private_key);
    try {
      jose.JWK.asKey(private_key, 'json').then(function(res) {
        jose.JWE.createDecrypt(res)
          .decrypt(body)
          .then(function(decrypted) {
            var decryptedObject = JSON.parse(
              decrypted.plaintext.toString('utf8')
            );
            console.log('decrypted object: ' + JSON.stringify(decryptedObject));
            resolve(decryptedObject);
          });
      });
    } catch (e) {
      console.log(`err: ` + JSON.stringify(e));
      reject(e);
    }
  });
}

function verifyCaptchaInternal(payload) {
    return new Promise(function(resolve, reject){
        console.log('payload:', payload);
        var answer = payload.answer;
        var nonce = payload.nonce;
        var validation = payload.validation;
      
        // Captcha by-pass for automated testing in dev/test environments
        //   if (
        //     process.env.BYPASS_ANSWER &&
        //     process.env.BYPASS_ANSWER.length > 0 &&
        //     process.env.BYPASS_ANSWER === answer
        //   ) {
        //     // Passed the captcha test
        //     winston.debug(`Captcha bypassed! Creating JWT.`);
      
        //     var token = jwt.sign(
        //       {
        //         data: {
        //           nonce: nonce
        //         }
        //       },
        //       SECRET,
        //       {
        //         expiresIn: JWT_SIGN_EXPIRY + 'm'
        //       }
        //     );
        //     return {
        //       valid: true,
        //       jwt: token
        //     };
        //   }
        // Normal mode, decrypt token
        let decryptedBody;
        try {
          decrypt(validation, PRIVATE_KEY).then(function(
            decryptedBody
          ) {
            if (decryptedBody !== null) {
              // Check answer
              console.log('decryptedBody: ', decryptedBody);
              console.log('answer: ', answer);
              if (decryptedBody.answer.toLowerCase() === answer.toLowerCase()) {
                if (decryptedBody.nonce === nonce) {
                  // Check expiry
                  if (decryptedBody.expiry > Date.now()) {
                    // Passed the captcha test
                    console.log('Passed the captcha verify');
      
                    var token = jwt.sign(
                      {
                        data: {
                          nonce: nonce
                        }
                      },
                      SECRET,
                      {
                        expiresIn: JWT_SIGN_EXPIRY + 'm'
                      }
                    );
                    resolve( {
                      valid: true,
                      jwt: token
                    });
                  } else {
                    // incorrect answer
                    console.log(
                      `Captcha expired: ` +
                        decryptedBody.expiry +
                        '; now: ' +
                        Date.now()
                    );
                    resolve( {
                      valid: false
                    });
                  }
                } else {
                  // incorrect nonce
                  console.log(
                    `nonce incorrect, expected: ` +
                      decryptedBody.nonce +
                      '; provided: ' +
                      nonce
                  );
                  resolve( {
                    valid: false
                  });
                }
              } else {
                // incorrect answer
                console.log(
                  `Captcha answer incorrect, expected: ` +
                    decryptedBody.answer +
                    '; provided: ' +
                    answer
                );
                resolve( {
                  valid: false
                });
              }
            } else {
              // Bad decyption
              console.log(`Captcha decryption failed`);
              resolve( {
                valid: false
              });
            }
          });
        } catch (e) {
          console.log('Error decrypting validation: ', e);
          resolve( {
            valid: false
          });
        }
    });
  
}

var captchaHandler = {
  getCaptcha: function(req, res, next) {
    var captcha = svgCaptcha.create({
      size: 6, // size of random string
      ignoreChars: '0o1il', // filter out some characters like 0o1i
      noise: 2 // number of lines to insert for noise
    });

    // add answer, nonce and expiry to body
    var unEncryptedResponse = {
      nonce: req.body.nonce,
      answer: captcha.text,
      expiry: Date.now() + CAPTCHA_SIGN_EXPIRY * 60000
    };
    encrypt(unEncryptedResponse).then(function(validation) {
      console.log(validation);

      var fullReponse = {
        captcha,
        validation
      };
      res.send(fullReponse);
      next();
    });
  },
  verifyCaptcha: function(req, res, next) {
    verifyCaptchaInternal(req.body).then(function(ret) {
      res.send(ret);
      next();
    });
  }
};

module.exports = captchaHandler;
