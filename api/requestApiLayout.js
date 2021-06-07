/**
 * Keep the email layout functions together, outside of index.js
 */
 'use strict';
const axios = require("axios");

function RequestAPI() {
    
     this.invokeRequestAPI = (data, apiUrl) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'              
            }
          };
        axios.post(apiUrl, data, axiosConfig)
          .then((response) => {
            console.log(`axios response = ${response.status}`);
            return response.status;
          })
          .catch((error) => {
            console.log(`axios error = ${error.message}`);
            return error.message;
          });
     };    
  };
  
  module.exports = { RequestAPI };