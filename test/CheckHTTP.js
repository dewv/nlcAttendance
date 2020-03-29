const http = require("http");
const querystring = require("querystring");
require("should");

class CheckHTTP {
    /**
    * Creates a new HTTP checking object.
    */
    constructor() {
    }

    /** 
     * Checks a round trip of the HTTP request/response cycle 
     * @argument {string} method - The request method. 
     * @argument {string} path - The request path.
     * @argument {Object} options - A dictionary of request options.
     * @argument {Object} expected - A dictionary describing the expected response. 
     * @argument {function} callback - A callback function. 
     * @returns {string} The HTML content of the response (as a callback argument).
     * @public
     */
    roundTrip(method, path, options, expected, callback) {
        // Authenticate using the role and id in options.
        this._authenticateAs(options.userRole, options.userId, function (sessionCookie) {
            let requestOptions = {
                port: 1337,
                method: method,
                path: path,
                headers: {
                    "Cookie": [sessionCookie],
                }
            };

            // Register the browser, unless options explicitly says not to.
            if (options.registerBrowser !== false) requestOptions.headers.Cookie.push("location=test");

            // Encode a (possibly default) payload for POST requests.
            let payload;
            if (method === "POST") {
                requestOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
                payload = querystring.stringify(options.payload || { payload: "dummy payload" });
                requestOptions.headers["Content-Length"] = Buffer.byteLength(payload);
            }

            // Make the request.
            let request = http.request(requestOptions, function (response) {
                // Verify the expected HTTP response code.
                response.statusCode.should.equal(expected.statusCode);

                // Check the expected (redirect) location, if defined.
                if (expected.location) response.headers.location.should.equal(expected.location);

                // When callback is defined, caller wants the response HTML.
                if (callback) {
                    // Event handler to build the body of the response (the HTML).
                    let body = "";
                    response.on("data", function (chunk) {
                        body += chunk;
                    });

                    // Event handler for end of response.
                    response.on("end", function () {
                        // Send page HTML via callback.
                        callback(body);
                    });
                }
            });

            if (method === "POST") request.write(payload);

            request.end();
        });
    }

    /**
     * Authenticates as a specified role and user ID.
     * @argument {string} role - The specified user role.
     * @argument {number} id - The user ID number.
     * @argument {function} callback - A callback function.
     * @returns {string} A session cookie (as a callback argument).
     * @private
     */
    _authenticateAs(role, id, callback) {
        // Allow for unauthenticated requests.
        if (typeof role === "undefined") return callback({});

        // Test records are created by models, with role as password.
        let credentials = querystring.stringify({
            "username": sails.models[role].testRecords[id - 1].username,
            "password": role
        });

        let options = {
            path: "/login",
            port: 1337,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(credentials)
            }
        };

        // POST the credentials.
        let request = http.request(options, function (response) {
            // Send cookie via callback.
            callback(response.headers["set-cookie"]);
        });

        request.write(credentials);
        request.end();
    }
}

module.exports = CheckHTTP;
