const axios = require("axios");
const bcrypt = require('bcryptjs');
// number of salt rounds
const saltRounds = 10;

// function to encrypt the password for secure access.
function hashPassword(password) {
  return bcrypt.hashSync(password, saltRounds);
}

// Exporting handler function
exports.handler = async (event, context) => {

  /**
   * Browser is sending a preflight request with an OPTIONS method
   * before the actual POST request to the Node JS API.
   * The `OPTIONS` request is used by the browser to check
   * if the server is willing to accept the actual request.
   * This request should also include the appropriate
   * CORS headers in the response.
   */
  if (event.httpMethod === "OPTIONS") {
    // Return the appropriate CORS headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://so-sandbox.carrd.co",
        "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Credentials": "true",
      },
      body: "OK",
    };
  }
  
  // Initialize constants i.e. Access Token, airtable Base Id, and Table Id
  const BEARER_TOKEN = "patEngYJi6Fab7tQk.2558ae83db32bbe93ca0812a73ce47d28d7b80733df8d0ae555d196fda825510";
  const APP_ID = "apptgyIoVWZvufmKj";
  const TABLE_ID = "tbletuTxr8llSxySY";

  // To handle cross-origin request set CORS headers in the response.
  const headers = {
    'Access-Control-Allow-Origin': 'https://so-sandbox.carrd.co',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
    'Access-Control-Allow-Credentials': 'true'
  };

  try {
    const { email, password } = JSON.parse(event.body);
    // Set the authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      },
    };
    // Construct the URL to fetch the user record from Airtable
    const airtableUrl = `https://api.airtable.com/v0/${APP_ID}/${TABLE_ID}?filterByFormula={Email}="${email}"`;
    // Fetch the user record from Airtable
    const response = await axios.get(airtableUrl, config);
    // Extract user data and record ID from the response
    const user = response.data.records[0];
    // Check if the user exists
    if (user) {
      const recordId = user.id
      /**
       * Encrypt the password and update the record in Airtable database
       * if the user password is undefined or null.
       */
      const hashedPassword = hashPassword(password);
        const updateDataConfig = {
          fields: {
            'Login Password': hashedPassword,
          },
        };
        // Make an API call to update the password for the registered user.
        const updateRecord = `https://api.airtable.com/v0/${APP_ID}/${TABLE_ID}/${recordId}`;
        try {
          const res = await axios.patch(updateRecord, updateDataConfig, config);
          return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "password updated" }),
          };
        } catch {
          throw error
        }
    } else {
      // Return a response if the user is not found
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ message: "Internal server issue" }),
    };
  }
}
