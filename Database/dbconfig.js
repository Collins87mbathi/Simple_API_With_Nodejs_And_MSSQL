// dbConfig.js
const dotenv = require("dotenv");
dotenv.config();


const config = {
    server: process.env.SERVER,
    database: process.env.DATABASE,
    driver: process.env.DRIVER,
    options: {
      trustedConnection:true
    },
  };
  
  module.exports = config;
  