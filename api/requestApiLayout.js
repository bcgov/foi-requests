/**
 * Keep the email layout functions together, outside of index.js
 */
 'use strict';
const FileReader = require('filereader');
const axios = require("axios");

function RequestAPI() {
    this.getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
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
    // this.invokeRequestAPI = function(requestData, apiUrl) {
    //     console.log(`URL = ${apiUrl}   requestData = ${requestData}`)
    //     const headers = {
    //         'Content-Type': 'application/json'           
    //       }
    //     axios({
    //         method: 'post',
    //         headers: headers,
    //         url: apiUrl,
    //         data: requestData
    //       });
    // };
  };
  
  module.exports = { RequestAPI };