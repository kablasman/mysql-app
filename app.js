const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const config = require('./config');
const { error } = require('console');

app.use(express.static('public'));
app.set('view engine', 'ejs');

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

// setting up http request, grabbing data from db
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

// defining another route
router.get('/fooditem/:id', (req,res) => {
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

//route to specific food item
// app.get('/foodItem/:id', (req, res) => {
//     // function that finds food item with specific id
//     const foodItem = groceryList.find(specificId => specificId.id === parseInt(req.params.id));
//     if (!foodItem) res.status(404).send('The food item with that ID was not found.'); // if not found on server, return 404
//     res.send(foodItem); // if found, return that item
// });

// add a food item to list
// app.post('/groceryList', (req, res) => {
//     const foodItem = {
//         id: groceryList.length +1,
//         name: req.body.name
//     }
//     groceryList.push(foodItem);
//     res.send(foodItem);
// })

app.use('/', router);

// configuring server port
app.listen(config.serverPort, () => {
    console.log(`listening on port 8080`);
});