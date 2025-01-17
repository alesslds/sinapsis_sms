// src/utils/responseBuilder.js

function buildResponse(statusCode, data) {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  }
  
  function buildErrorResponse(statusCode, errorData) {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(errorData),
    };
  }
  
  module.exports = {
    buildResponse,
    buildErrorResponse,
  };
  