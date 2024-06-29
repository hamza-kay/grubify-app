const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const mysql2 = require('mysql2');

const router = express.Router();

// Call this function to generate a new access token using the refresh token
function refreshAccessToken() {

}

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

// router.get('/test', async (req, res) => {
//     console.log('test successful');
// });

router.get('/authorization', async (req, res) => {
    const cache = new NodeCache();    

    // Have the code
    var authorizationCode = req.query.code;
    console.log(`***** code: ${authorizationCode}`);

    // Make request to get access token
    const response = await axios.post('https://connect.squareup.com/oauth2/token', {
        client_id: process.env.SQ_APPLICATION_ID,
        client_secret: process.env.SQ_APPLICATION_SECRET,
        code: authorizationCode,
        grant_type: 'authorization_code'
    });

    console.log(response.data);

    // store access token in backend memory
    const obj = { 
        access_token: response.data.access_token, 
        expires_at: response.data.expires_at,
        merchant_id: response.data.merchant_id
    };

    const cacheKeyName = response.data.merchant_id + '-key';
    const success = cache.set( cacheKeyName, obj, 10000 );

    // save refresh token to db
    const query = `INSERT INTO auth (merchant_id, refresh_token) VALUES(` + `'${response.data.merchant_id}','${response.data.refresh_token}');`;
    console.log(`running query: ${query}`);

    pool.query(query, (error, results) => {
        if (!results) {
            console.log(`sql error when saving refresh token: ${error}`);
        } else {
            
            console.log(`sql success when saving refresh token`);
        }
    });
});

module.exports = router;