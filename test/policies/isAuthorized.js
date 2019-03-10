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
    });

    context("when user is authenticated staff", function() {
        it("should authorize staff to edit their own user profile", function() {
            // (await isRequestAuthorized("GET", "/student/0/edit")).should.be.true();
            // (await isRequestAuthorized("POST", "/student/0")).should.be.true();
        });
    });


    it("should forbid all other requests for user profiles", function() {});
    it("should authorize students to create a visit record", function() {});
    it("should authorize students to edit their own most recent visit record", function() {});
    it("should authorize staff to view all visit records", function() {});
    it("should forbid all other requests for visit records", function() {});

    it("should authorize staff to get staff menu", function() {});
    it("should forbid students to get staff menu", function() {});

    it("should authorize staff to register the browser", function() {});
    it("should forbid students to register the browser", function() {});
});
