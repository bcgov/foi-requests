/**
 * Keep the email layout functions together, outside of index.js
 */
 'use strict';
const FileReader = require('filereader');
const axios = require("axios");

function RequestAPI() {
    
     this.invokeRequestAPI = (data, apiUrl) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'              
            }
          };
        return axios.post(apiUrl, data, axiosConfig);
        
     };   
  };  
  module.exports = { RequestAPI };