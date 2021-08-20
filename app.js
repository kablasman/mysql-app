const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const config = require('./config');
const { error } = require('console');
const { reduce } = require('async');
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});

app.use(express.static('public'));
app.set('view engine', 'ejs');

console.log("process", process.env.NODE_ENV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// connecting to mysql database
const dbConnection = mysql.createConnection(config.dbConfig);
dbConnection.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('Connected to database');
})

// ------------- MOVED TO MYSQL ----------------
// const groceryList = [
//     {
//         id: 1,
//         name: 'pineapple',
//     },
//     {
//         id: 2,
//         name: 'oranges',
//     },
//     {
//         id: 3,
//         name: 'apples',
//     },
//     {
//         id: 4,
//         name: 'bananas',
//     },
//     {
//         id: 5,
//         name: 'eggs',
//     },
//     {
//         id: 6,
//         name: 'bread',
//     },
//     {
//         id: 7,
//         name: 'pasta',
//     },
//     {
//         id: 8,
//         name: 'butter',
//     },
//     {
//         id: 9,
//         name: 'cookies',
//     },
//     {
//         id: 10,
//         name: 'lettuce',
//     },

// ]

// setting up http request, grabbing data from db, home page
router.get('/', (req, res) => {
    const query = `SELECT * FROM GroceryList ORDER BY id ASC`
    dbConnection.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        res.render('index', {
            groceryList: result,
        });
    })
});

// defining another route for food item page
router.get('/fooditem/:id', (req, res) => {
    const foodId = req.params.id;
    console.log('foodId', foodId);
    const query = `SELECT * FROM GroceryList WHERE id = ${foodId}`;
    dbConnection.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        res.render('fooditem', {
            foodItem: result[0]
        });
    });
});

// defining endpoint for add item page 
router.get('/add-list-item', (req, res) => {
    res.render('add-list-item');
});

// creating endpoint route for adding food item to list (posting item to mysql)
router.post('/add-to-list', (req, res) => {
    const query = `INSERT INTO GroceryList (name) VALUES ('${req.body.name}')`;
    dbConnection.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        res.writeHead(302, {Location: '/'});
        res.end();
    });
});

// creating endpoint route for deleting food item from list (posting delete to mysql)
router.post('/delete', (req, res) => {
    console.log('req', req.body.id);
    const query = `DELETE FROM GroceryList WHERE id = ${req.body.id}`;
    dbConnection.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        res.writeHead(302);
        res.end();
    });
});

// creating endpoint route for updating food item in single page (posting update to mysql)
router.post('/update-item', (req, res) => {
    const query = `UPDATE GroceryList SET name = '${req.body.name}' WHERE id = ${req.body.id}`;
    dbConnection.query(query, (err, result) => {
        if(err) {
            throw err;
        }
        res.writeHead(302, {Location: '/'});
        res.end();
    });
});

app.use('/', router);

// configuring server port
app.listen(config.serverPort, () => {
    console.log(`listening on port 8080`);
});