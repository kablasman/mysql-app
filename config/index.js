const config = {};
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});
config.serverPort = process.env.SERVER_PORT;
console.log("process***", process.env.SERVER_PORT);

// setting up server using environment variables, secures data
config.dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
}

module.exports = config;