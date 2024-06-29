const express = require('express');
const NodeCache = require('node-cache');
const router = express.Router();
const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

// Call this function to generate a new access token using the refresh token
function refreshAccessToken() {

}

router.get('/test', async (req, res) => {
    return res.status(200).send('all good');
});

/**
 * Create a single menu for a merchant
 */
router.post('/menu', async (req, res) => {    
    const merchant_id = req.body.merchant_id;
    const title = req.body.title;

    const query = `INSERT INTO menu (merchant_id, title) VALUES(` + `'${merchant_id}','${title}');`;
    console.log(`running query: ${query}`);

    pool.query(query, (error, results) => {
        if (!results) {
            console.log(`sql error when saving refresh token: ${error}`);
        } else {
            console.log(`sql success when saving refresh token`);
            
        }
    });

    return res.status(201).send('Successfully created menu.')
});

/**
 * Create a section of a menu, e.g. starters, beverages or desserts
 */
router.post('/section', async (req, res) => {    
    console.log(req.body);
    const arr = req.body;

    // loop through the array and save to the database
    for( let i = 0; i< arr.length; i++) {
        const menu_id = arr[i].menu_id;
        const title = arr[i].title;
        const image = arr[i].image;

        // save the section to database
        const query = `INSERT INTO section (menu_id, title, image) VALUES(` + `'${menu_id}','${title}','${image}');`;        
        console.log(`running query: ${query}`);
        pool.query(query, (error, results) => {
            if (!results) {
                console.log(`sql error when saving refresh token: ${error}`);
            } else {
                console.log(`sql success when saving refresh token`);   
            }
        });
      }

    return res.status(201).send('Successfully created sections.');
});

/**
 * Create items for a specific section.
 */
router.post('/items', async (req, res) => {    
    console.log(req.body);
    const arr = req.body;

    // loop through the array and save to the database
    for( let i = 0; i< arr.length; i++) {
        const section_id = arr[i].section_id;
        const name = arr[i].name;
        const price = arr[i].price;
        const variation = arr[i].variation;
        const size = arr[i].size;
        const image = arr[i].image;
        const addon = arr[i].addon;

        // save the section to database
        const query = `INSERT INTO menu_items (section_id, name, price, variation, size, image, addon) VALUES(` + `'${section_id}','${name}','${price}','${variation}','${size}','${image}','${addon}');`;        
        console.log(`running query: ${query}`);
        pool.query(query, (error, results) => {
            if (!results) {
                console.log(`sql error when saving refresh token: ${error}`);
            } else {
                console.log(`sql success when saving menu items`);   
            }
        });
      }

    return res.status(201).send('Successfully created menu items for section.');
});

/**
 * Create a single menu for a merchant
 */
router.get('/menu/:merchantId', async (req, res) => {    
    const merchantId = req.params.merchantId;

    const query = `SELECT * FROM menu WHERE merchant_id = '${merchantId}' LIMIT 1;`;        
        console.log(`running query: ${query}`);
        pool.query(query, (error, results) => {
            if (!results) {
                console.log(`sql error when saving refresh token: ${error}`);
            } else {
                /**
                 [
                    {
                        id: 1,
                        merchant_id: 'jsdoasdasd',
                        title: 'dasdasdasd',
                        image: null
                    }
                 ]
                 */
                console.log(`sql success when saving menu items: ${results}`);
                console.log(results[0]);
                return res.status(200).send(results[0]);
            }
        });
});

/**
 * Return all sections for a given menuId
 */
router.get('/section/:menuId', async (req, res) => {    
    const menuId = req.params.menuId;

    const query = `SELECT * FROM section WHERE menu_id = '${menuId}';`;        
        console.log(`running query: ${query}`);
        pool.query(query, (error, results) => {
            if (!results) {
                console.log(`sql error when retrieving sections for menuId: ${menuId}`);
            } else {
                console.log(`sql success when getting sections for: ${menuId}`);
                console.log(results);
                return res.status(200).send(results);
            }
        });
});

/**
 * Return all sections for a given menuId
 */
router.get('/items/:sectionId', async (req, res) => {    
    const sectionId = req.params.sectionId;

    const query = `SELECT * FROM menu_items WHERE section_id = '${sectionId}';`;        
        console.log(`running query: ${query}`);
        pool.query(query, (error, results) => {
            if (!results) {
                console.log(`sql error when retrieving menu items for sectionId: ${sectionId}`);
            } else {
                console.log(`sql success when getting menu items for: ${sectionId}`);
                console.log(results);
                return res.status(200).send(results);
            }
        });
});

module.exports = router;