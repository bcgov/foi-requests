'use strict';

module.exports = {
  CAPTCHA_TOKEN_SECRET : process.env.CAPTCHA_TOKEN_SECRET || 'defaultSecret',
  CAPTCHA_EXPIRY_MINUTES: '15',
  CAPTCHA_TOKEN_HEADER: 'Authorization', 
  CAPTCHA_NONCE_HEADER: 'captcha-nonce'
};