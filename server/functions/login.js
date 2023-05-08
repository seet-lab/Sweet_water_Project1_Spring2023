const axios = require("axios");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * function to compare password.
 * @params: 
 * password - user entered password value
 * hash - encrypted password value stored in database
 */
function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

exports.handler = async (event) => {

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
  
  /**
   * This code block declares three constants:
   * BEARER_TOKEN, APP_ID, and TABLE_ID.
   * BEARER_TOKEN is a sensitive piece of information used for authentication or authorization.
   * APP_ID and TABLE_ID are a unique identifier for a table that may be used when performing
   * CRUD operations or other database-related tasks in the application.
   */
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
    // get email and password values from requested API body.
    const { email, password } = JSON.parse(event.body);
    // Configure/set `BEARER_TOKEN` in the headers for secured connection.
    const config = {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      },
    };
    /**
     * Airtable web API to access user information from the Airtable database
     * table using user's email Id.
     * Fetch the information using Axios `GET` method.
     */
    const airtableUrl = `https://api.airtable.com/v0/${APP_ID}/${TABLE_ID}?filterByFormula={Email}="${email}"`;
    const response = await axios.get(airtableUrl, config);
    const user = response.data.records[0];
    /**
     * Set the JWT token, userinfo and record Id in the session variables,
     * if the user exists in the database. If the user does not exist,
     * return response with `no match` in order to force user to
     * set their password using forgot password.
     */
    if (user) {
      const userPassword = user.fields["Login Password"];
      const recordId = user.id
      const userName = user.fields['First Name'];
      if (userPassword === undefined) {
        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({ message: "password not found" }),
        };
      } else {
        const isPasswordMatch = comparePassword(password, userPassword);
        if (isPasswordMatch) {
          // Create JWT token to secure the connection.
          const JWT_SECRET='f3f2c9b71da9249632db56ead8881559f8039e4e49a89ce7e08d07fddcb32a2f'
          const token = jwt.sign({ email }, JWT_SECRET);
          const loginHeaders = {
            'Access-Control-Allow-Origin': 'https://so-sandbox.carrd.co',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
            'Access-Control-Allow-Credentials': 'true',
            'Set-Cookie': `jwtToken=${token}; HttpOnly; SameSite=None; Path=/`
          };
          return {
            statusCode: 200,
            headers: loginHeaders,
            body: JSON.stringify({ token, loggedInUserName: userName, recordId }),
          };
        } else {
          return {
            statusCode: 401,
            headers: headers,
            body: JSON.stringify({ message: "no match" }),
          };
        }
      }
    } else {
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
