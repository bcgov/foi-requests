'use strict';

var svgCaptcha = require('svg-captcha');
var jose = require('node-jose');
var jwt = require('jsonwebtoken');

var wav = require('wav');
var text2wav = require('text2wav');
var arrayBufferToBuffer = require('arraybuffer-to-buffer');
var streamifier = require("streamifier");
var lame = require('lame');

const SECRET = process.env.SECRET || 'defaultSecret';
const JWT_SIGN_EXPIRY = process.env.JWT_SIGN_EXPIRY || '15'; // In minutes
const PRIVATE_KEY = process.env.PRIVATE_KEY
  ? JSON.parse(process.env.PRIVATE_KEY)
  : {
      kty: 'oct',
      kid: 'gBdaS-G8RLax2qObTD94w',
      use: 'enc',
      alg: 'A256GCM',
      k: 'FK3d8WvSRdxlUHs4Fs_xxYO3-6dCiUarBwiYNFw5hv8'
    };

const CAPTCHA_SIGN_EXPIRY = 15;

const voicePromptLanguageMap = {
  en: 'Please type in following letters or numbers', // english
  fr: 'Veuillez saisir les lettres ou les chiffres suivants', // french
  pa: 'ਕਿਰਪਾ ਕਰਕੇ ਹੇਠ ਲਿਖੇ ਅੱਖਰ ਜਾਂ ਨੰਬਰ ਟਾਈਪ ਕਰੋ', // punjabi
  zh: '请输入以下英文字母或数字' // mandarin chinese
};

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
  return new Promise(function(resolve, reject) {
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
      decrypt(validation, PRIVATE_KEY).then(function(decryptedBody) {
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
                resolve({
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
                resolve({
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
              resolve({
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
            resolve({
              valid: false
            });
          }
        } else {
          // Bad decyption
          console.log(`Captcha decryption failed`);
          resolve({
            valid: false
          });
        }
      });
    } catch (e) {
      console.log('Error decrypting validation: ', e);
      resolve({
        valid: false
      });
    }
  });
}

function getAudio(body, req) {
  return new Promise(function(resolve, reject) {
    try {
      // pull out encrypted answer
      var validation = body.validation;

      // decrypt payload to get captcha text
      decrypt(validation, PRIVATE_KEY).then(function(decryptedBody) {
        console.log('get audio decrypted body', body);

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
        getMp3DataUriFromText(spokenCatpcha, language).then(function(
          audioDataUri
        ) {
          // Now pass back the full payload ,
          resolve({
            audio: audioDataUri
          });
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
  return new Promise(async function(resolve) {
    // init wave reader, used to convert WAV to PCM
    var reader = new wav.Reader();

    // we have to wait for the "format" event before we can start encoding
    reader.on('format', function(format) {
      // init encoder
      console.log('Init mp3 encoder');
      var encoder = new lame.Encoder(format);

      // Pipe Wav reader to the encoder and capture the output stream
      console.log('Pipe WAV reader to MP3 encoder');

      // As the stream is encoded, convert the mp3 array buffer chunks into base64 string with mime type
      var dataUri = 'data:audio/mp3;base64,';
      encoder.on('data', function(arrayBuffer) {
        if (!dataUri) {
          return;
        }
        console.log(
          'Encoder output received chunk of bytes, convert to base64 string'
        );
        dataUri += arrayBuffer.toString('base64');
        // by observation encoder hung before finish due to event loop being empty
        // setTimeout injects an event to mitigate the issue
        setTimeout(() => {}, 0);
      });

      // When encoding is complete, callback with data uri
      encoder.on('finish', function() {
        console.log('Finished converting to MP3');
        resolve(dataUri);
        dataUri = undefined;
      });
      reader.pipe(encoder);
    });

    // Generate audio, Base64 encoded WAV in DataUri format including mime type header
    console.log('Generate speach as WAV in ArrayBuffer');
    text2wav(text, { voice: language }).then(function(audioArrayBuffer) {
      // convert to buffer
      console.log('Convert arraybuffer to buffer');
      var audioBuffer = arrayBufferToBuffer(audioArrayBuffer);

      // Convert ArrayBuffer to Streamable type for input to the encoder
      console.log('Streamify our buffer');
      var audioStream = streamifier.createReadStream(audioBuffer);

      // once all events setup we can the pipeline
      console.log('Pipe audio stream to WAV reader');
      audioStream.pipe(reader);
    });
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
  },
  getCaptchaAudio: function(req, res, next) {
    getAudio(req.body, req).then(function(ret) {
      res.send(ret);
      next();
    });
  }
};

module.exports = captchaHandler;
