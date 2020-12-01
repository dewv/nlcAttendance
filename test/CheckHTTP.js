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
     * @returns {string} The HTML content of the response.
     * @public
     */
    async roundTrip(method, path, options, expected) {
        // Authenticate using the role and id in options.
        let sessionCookie = await this._authenticateAs(options.userRole, options.userId);

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
        return new Promise(function (resolve, reject) {
            let request = http.request(requestOptions);

            request.on("response", function (response) {
                // Verify the expected HTTP response code.
                response.statusCode.should.equal(expected.statusCode);

                // Check the expected (redirect) location, if defined.
                if (expected.location) response.headers.location.should.equal(expected.location);

                let body = "";

                // Event handler to build the body of the response (the HTML).
                response.on("data", function (chunk) {
                    body += chunk;
                });

                // Event handler for end of response.
                response.on("end", function () {
                    // Send page HTML via callback
                    resolve(body);
                });
            });

            request.on("error", function (error) {
                // For unknown reasons, testing a file download gives error.
                if (error.code === "ECONNREFUSED") {
                    console.warn(`Suppressing ${error.code}`);
                    return;
                }
                console.error(error);
                reject(error);
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
    async _authenticateAs(role, id) {
        return new Promise(function (resolve, reject) {
            // Allow for unauthenticated requests.
            if (typeof role === "undefined") {
                resolve({});
            }

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
            let request = http.request(options);

            request.on("response", function (response) {
                resolve(response.headers["set-cookie"]);
            });

            request.on("error", function (error) {
                console.error(`Login request error: ${error}`);
                reject(error);
            });

            request.write(credentials);
            request.end();
        });
    }
}

module.exports = CheckHTTP;
