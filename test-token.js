// Test script to directly verify PayFast token generation
const https = require('https');
const querystring = require('querystring');

// PayFast API credentials
const data = {
  MERCHANT_ID: '26623',
  SECURED_KEY: '_kqbD5giY0EgPsq_R4JUgg',
  BASKET_ID: 'ITEM-TEST1',
  TXNAMT: '5',
  CURRENCY_CODE: 'PKR'
};

// Convert data to URL-encoded form data (exactly like PHP does)
const postData = querystring.stringify(data);

const options = {
  hostname: 'ipg1.apps.net.pk',
  port: 443,
  path: '/Ecommerce/api/Transaction/GetAccessToken',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'CURL/PHP PayFast Example'
  }
};

// Send request
const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Data:');
    console.log(responseData);
    
    try {
      const jsonResponse = JSON.parse(responseData);
      console.log('Parsed JSON:');
      console.log(jsonResponse);
      
      if (jsonResponse.ACCESS_TOKEN) {
        console.log(`\nACCESS_TOKEN: ${jsonResponse.ACCESS_TOKEN}`);
      } else {
        console.log('\nNo ACCESS_TOKEN found in response');
      }
    } catch (e) {
      console.error('Failed to parse response as JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();

console.log('Request sent with data:', postData); 