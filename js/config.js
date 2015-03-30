/**
 * DATABASE CONNECTION SETTINGS
 */
var DB_NAME = "gtest";
var DB_TYPE = "mongodb";
var DB_HOST = "localhost";
var DB_PORT = "27017";
var DB_OPTS = {
   //connectTimeoutMS:  2000,
   //socketTimeoutMS: 1000,
   //maxPoolSize: 5,
   //authSource: null
   ssl: false,
   w:1
}

/**
 * HTTP NETWORK SETTINGS
 */
var HTTP_PORT = 80;

var querystring = require("querystring");

var DB_URL = (function() {
   var arr = [
      DB_TYPE,
      '://',
      DB_HOST,
      ':',
      DB_PORT,
      '/',
      DB_NAME,
      '?',
      querystring.stringify(DB_OPTS)
   ];
   return arr.join("");
})();

module.exports = {
   db: {
      name: DB_NAME,
      host: DB_HOST,
      port: DB_PORT,
      options: DB_OPTS,
      url: DB_URL
   },

   http: {
      port: HTTP_PORT
   }
};