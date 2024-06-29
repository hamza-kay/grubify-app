const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const mysql2 = require('mysql2');

const router = express.Router();

// Call this function to generate a new access token using the refresh token
function refreshAccessToken() {

}

const pool = mysql2.createPool({
    host: 'cvktne7b4wbj4ks1.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'un2uz57ysd2juvdl',
    password: 'okrzm64djy5vni98',
    database: 'v2ycvazsfmgokrd9'
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
        client_id: 'sq0idp-HTffshYsOIyag5YGV4ZfTA',
        client_secret: 'sq0csp-QO9oR_GF0zuBbQQ554fDuOEnvoCkmfe4PHUVegPtRp0',
        code: authorizationCode,
        grant_type: 'authorization_code'
    });

    /**
    {
        access_token: 'EAAAljuAIyPuSkj8zHJWdSWRjuD3ehogQNmJv31s-L0D-6qj3zPJhCirOaLAVU8M',
        token_type: 'bearer',
        expires_at: '2024-07-24T14:33:12Z',
        merchant_id: 'MLRKK069REG5G',
        refresh_token: 'EQAAlpgfxrDFsoP1itRTuiL9UmspAU82C2UkAjDn9W3kZit6XAzdd2fda0zGVchh',
        short_lived: false
    }
     */
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