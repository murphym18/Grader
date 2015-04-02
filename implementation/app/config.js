var path = require('path');
var fs = require('fs');

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


/* DATABASE SETTINGS */
/**
 * Use in memory database only.
 * When this is true the DATABASE_DIR value is ignored.
 */
var DATABASE_IN_MEM_STORE = false;

/**
 * The directory where the database files will be stored. This path may be
 * absolute or its assumed relative to the working directory.
 */
var DATABASE_DIR = "./data/documents";


/* SESSION STORAGE SETTINGS */
/**
 * The directory where the session files will be stored. This path may be
 * absolute or its assumed relative to the working directory.
 */
var SESSION_STORAGE_DIR = "./data/sessions";

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


function resolvePath(place) {

   return path.isAbsolute(place.toString()) ? place.toString() : path.relative(process.cwd(), place.toString());
}

function ensureDir(place, errMsg) {
   if (!fs.existsSync(place)) {
      try {
         console.log(place);
         fs.mkdirSync(place);
      }
      catch (e) {
         var msg = errMsg || "ERROR: ";
         throw msg + " " + place + "\n\t" + e;
      }
   }
   return place;
}

module.exports = {
   db: {
      path: ensureDir(resolvePath(DATABASE_DIR), "Error creating database directory"),
      memStore: DATABASE_IN_MEM_STORE
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

   session: {
      path: ensureDir(resolvePath(SESSION_STORAGE_DIR), "Error creating database directory"),
      secret:(function(){
         if (SESSION_SECRET !== null) {
            return SESSION_SECRET;
         }
         var crypto = require('crypto');
         var buf = crypto.randomBytes(256);

         var hash = crypto.createHash('sha256');
         hash.update(buf);
         return hash.digest('base64');
      })()
   }
};