/* Request API integration 
 *  FOI-Flow python API is getting invoked here
 *  Save raw request data to DB
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
        return axios.post(apiUrl, data, axiosConfig);
        
     };

     this.invokeGetFeeDetails = (apiUrl) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'              
            }
          };
        return axios.get(apiUrl, axiosConfig);        
     };

     this.invokeCreatePayment = (data, apiUrl) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'              
            }
          };
        return axios.post(apiUrl, data, axiosConfig);        
     };

     this.invokeUpdatePayment = (data, apiUrl) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'              
            }
          };
        return axios.put(apiUrl, data, axiosConfig);        
     };
  };  
  module.exports = { RequestAPI };