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




var DB_QSTR = (function() {
   var arr = [];
   for (x in DB_OPTS) {
      if (DB_OPTS.hasOwnProperty(x))
         arr.push(encodeURIComponent(x) + "=" + encodeURIComponent(DB_OPTS[x]));
   }
   return arr.length == 0 ? "" : "?" + arr.join("&");
})();

var DB_URL = (function() {
   return DB_TYPE + '://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME + DB_QSTR;
})();

module.exports = {
   db: {
      name: DB_NAME,
      host: DB_HOST,
      port: DB_PORT,
      options: DB_OPTS,
      url: DB_URL
   }
};