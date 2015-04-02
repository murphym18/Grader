/**
 * DATABASE SETTINGS
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
 * HTTP SETTINGS
 */
var HTTP_PORT = 80;

/**
 * CAS SETTINGS
 */
var SSO_BASE_URL =  "https://my.calpoly.edu/cas/";
var SERVER_BASE_URL = "http://localhost";

/**
 * DEBUG SETTINGS
 */
var SHOW_VERBOSE_ERROR_PAGES = true;

/**
 * The express-session uses this secret to sign the session ID cookie. When this
 * variable is null, this module exports a random string.
 *
 * The express-session readme explains:
 *
 * This can be either a string for a single secret, or an array of multiple
 * secrets. If an array of secrets is provided, only the first element will be
 * used to sign the session ID cookie, while all the elements will be
 * considered when verifying the signature in requests.
 *
 */
var SESSION_SECRET = null;



module.exports = {
   db: {
      name: DB_NAME,
      host: DB_HOST,
      port: DB_PORT,
      options: DB_OPTS,
      url: (function() {
         var arr = [
            DB_TYPE,
            '://',
            DB_HOST,
            ':',
            DB_PORT,
            '/',
            DB_NAME,
            '?',
            require("querystring").stringify(DB_OPTS)
         ];
         return arr.join("");
      })()
   },

   http: {
      port: HTTP_PORT
   },

   cas: {
      "version": 'CAS3.0',
      "ssoBaseURL": SSO_BASE_URL, /* base url for cas server*/
      "serverBaseURL": SERVER_BASE_URL, /* base url for grader app server*/
      "validateURL": '/serviceValidate'
   },

   showVerboseErrors: SHOW_VERBOSE_ERROR_PAGES,

   "sessionSecret": (function(){
      if (SESSION_SECRET !== null) {
         return SESSION_SECRET;
      }
      var crypto = require('crypto');
      var buf = crypto.randomBytes(256);

      var hash = crypto.createHash('sha256');
      hash.update(buf);
      return hash.digest('base64');
   })()
};