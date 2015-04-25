/**
 * App configuration settings
 * @author Michael Murphy
 */

/* HTTP SETTINGS */
exports.http = {};

/**
 * Server port
 */
exports.http.port = 8080;

/**
 * Creates missing directories.
 *
 * The database and session modules need directories to store their files in.
 * Set this option to true to have the app create these directories plus any
 * parent directories if they don't exist.
 */
exports.createMissingDirectories = true;

/* DEBUG SETTINGS */
/**
 * If <code>true</code> then errors caused during an HTTP request result in a
 * detailed error response. If false then a generic HTTP error response is used.
 */
exports.showVerboseErrors = true;

/**
 * If true then the <code>verboseLog</code> function in app/util.js is bound to
 * <code>console.log</code>. If false then <code>verboseLog</code> is bound to
 * a function that does nothing.
 */
exports.verboseLog = false;

/* DATABASE SETTINGS */
exports.db = {};

/**
 * Use in memory database only.
 * When this is true the <code>exports.db.path</code> value is ignored.
 */
exports.db.memStore = false;

/**
 * The directory where the database files will be stored. This path may be
 * absolute or its assumed relative to the working directory.
 */
exports.db.path = "data/documents";


/* SESSION STORAGE SETTINGS */
exports.session = {};
/**
 * The directory where the session files will be stored. This path may be
 * absolute or its assumed relative to the working directory.
 */
exports.session.path = "data/sessions";

/**
 * The server uses this string to sign the session ID cookie. When this
 * variable is null, a random secret is generated.
 *
 * The express-session readme explains:
 *
 * This can be either a string for a single secret, or an array of multiple
 * secrets. If an array of secrets is provided, only the first element will be
 * used to sign the session ID cookie, while all the elements will be
 * considered when verifying the signature in requests.
 *
 */
exports.session.secret = null;
