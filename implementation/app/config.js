/**
 * App configuration settings
 * @author Michael Murphy
 */

/* HTTP SETTINGS */
exports.http = {};

/**
 * Server port
 */
exports.http.port = 80;

/**
 * Creates missing subdirectories.
 *
 * The database and session modules need directories to store their files in.
 * This option creates those directories plus and parent directories if they
 * don't exist.
 */
exports.createMissingDirectories = true;

/**
 * DEBUG SETTINGS
 */
exports.showVerboseErrors = true;


/* DATABASE SETTINGS */
exports.db = {};

/**
 * Use in memory database only.
 * When this is true the DATABASE_DIR value is ignored.
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
