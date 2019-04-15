const http = require("http");
const status = require("http-status");
const querystring = require("querystring");
require("should");

const loginPath = "/login";

function authenticateAs(role, callback) {
    let credentials = querystring.stringify({
        "username": sails.models[role].testRecords[0].username,
        "password": role
    });

    let options = {
        path: loginPath,
        port: 8080,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(credentials)
        }
    };

    let request = http.request(options, function(response) {
        callback(response.headers["set-cookie"]);
    });
    request.write(credentials);
    request.end();
}

/**
 * Determines if an HTTP request is authorized.
 * @argument {string} method - The HTTP method of the request.
 * @argument {string} path - The relative URL of the request.
 * @argument {function} callback - The function to call on completion.
 */
function isRequestAuthorized(method, path, sessionCookie, callback) {
    let options = {
        port: 8080,
        method: method,
        path: path,
        headers: {
            "Cookie": sessionCookie
        }
    };

    let request = http.request(options, function(response) {
        return callback(response.statusCode !== status.FORBIDDEN);
    });

    request.end();
}

describe("`isAuthorized` policy", function() {
    context("when the user is an authenticated student", function() {
        let studentSession = undefined;

        before(function(done) {
            authenticateAs("student", function(cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/1/edit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function(done) {
            isRequestAuthorized("POST", "/student/1", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user profiles in the edit form");

        it("should forbid requests to update other user profiles");

        it("should authorize requests to load the visit create form");

        it("should authorize requests to submit the visit create form");

        it("should authorize requests to load their own most recent visit in the edit form");

        it("should authorize requests to update their own most recent visit");

        it("should forbid requests to load their older visits in the edit form");

        it("should forbid requests to update their older visits");

        it("should forbid requests to load other user's visits in the edit form");

        it("should forbid requests to update other user's visits");

        it("should forbid requests to get the staff menu");

        it("should forbid requests to view all visit records");

        it("should forbid requests to load the browser registration form");

        it("should forbid requests to submit the browser registration form");
    });

    context("when the user is authenticated staff", function() {
        let staffSession = undefined;

        before(function(done) {
            authenticateAs("staff", function(cookie) {
                staffSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form");

        it("should authorize requests to update their own profile");

        it("should forbid requests to load other user profiles in the edit form");

        it("should forbid requests to update other user profiles");

        it("should authorize requests to get the staff menu");

        it("should authorize requests to view all visit records");

        it("should authorize requests to load the browser registration form");

        it("should authorize requests to submit the browser registration form");

        it("should forbid requests to load the visit create form");

        it("should forbid requests to submit the visit create form");

        it("should forbid requests to load the visit edit form");

        it("should forbid requests to update visits");
    });
});
