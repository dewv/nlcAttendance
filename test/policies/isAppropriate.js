const http = require("http");
const status = require("http-status");
const querystring = require("querystring");
require("should");

const loginPath = "/login";

function authenticateAs(role, testRecordNumber, callback) {
    let credentials = querystring.stringify({
        "username": sails.models[role].testRecords[testRecordNumber].username,
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
        callback(sails.models[role].testRecords[testRecordNumber], response.headers["set-cookie"]);
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
function isRedirect(method, requestPath, redirectPath, sessionCookie, callback) {
    let options = {
        port: 8080,
        method: method,
        path: requestPath,
        headers: {
            "Cookie": sessionCookie
        }
    };

    let request = http.request(options, function(response) {
        return callback(response.statusCode === status.FOUND && response.headers.location === redirectPath);
    });

    request.end();
}

describe("`isAppropriate` policy", function() {
    context("when the user is an authenticated student", function() {
        let student = undefined;
        let studentSession = undefined;

        context("with the mandatory profile update flag set", function() {

            before(function(done) {
                authenticateAs("student", 1, function(studentRecord, cookie) {
                    student = studentRecord;
                    studentSession = cookie;
                    done();
                });
            });

            it("should redirect requests to their own profile edit form", function(done) {
                isRedirect("GET", "/", `/student/${student.id}/edit`, studentSession, function(redirected) {
                    redirected.should.be.true();
                    done();
                });
            });
        });

        context("who is checked out", function() {

            before(function(done) {
                authenticateAs("student", 6, function(studentRecord, cookie) {
                    student = studentRecord;
                    studentSession = cookie;
                    done();
                });
            });

            it("should NOT redirect requests to their own profile edit form", function(done) {
                isRedirect("GET", `/student/${student.id}/edit`, "/", studentSession, function(redirected) {
                    redirected.should.be.false();
                    done();
                });
            });

            it("should redirect all other requests to the visit create form", function(done) {
                isRedirect("GET", "/", `/visit/new`, studentSession, function(redirected) {
                    redirected.should.be.true();
                    done();
                });
            });
        });

        context("who checked in earlier today", function() {
            
            before(function(done) {
                authenticateAs("student", 8, function(studentRecord, cookie) {
                    student = studentRecord;
                    studentSession = cookie;
                    done();
                });
            });

            it("should NOT redirect requests to their own profile edit form", function(done) {
                isRedirect("GET", `/student/${student.id}/edit`, "/", studentSession, function(redirected) {
                    redirected.should.be.false();
                    done();
                });
            });

            it("should redirect all other requests to the visit edit form, \"normal\" mode", function(done) {
                isRedirect("GET", "/", `/visit/32/edit`, studentSession, function(redirected) {
                    redirected.should.be.true();
                    done();
                });
            });
        });

        context("who checked in yesterday, or before", function() {
            
            before(function(done) {
                authenticateAs("student", 7, function(studentRecord, cookie) {
                    student = studentRecord;
                    studentSession = cookie;
                    done();
                });
            });

            it("should NOT redirect requests to their own profile edit form", function(done) {
                isRedirect("GET", `/student/${student.id}/edit`, "/", studentSession, function(redirected) {
                    redirected.should.be.false();
                    done();
                });
            });

            it("should redirect all other requests to the visit edit form, \"estimate\" mode", function(done) {
                isRedirect("GET", "/", `/visit/31/edit`, studentSession, function(redirected) {
                    redirected.should.be.true();
                    done();
                });
            });
        });
    });

    context("when the user is authenticated staff", function() {
        let staff = undefined;
        let staffSession = undefined;

        context("with the mandatory profile update flag set", function() {
            before(function(done) {
                authenticateAs("staff", 0, function(staffRecord, cookie) {
                    staff = staffRecord;
                    staffSession = cookie;
                    done();
                });
            });

            it("should redirect requests to their own profile edit form", function(done) {
                isRedirect("GET", "/", `/staff/${staff.id}/edit`, staffSession, function(redirected) {
                    redirected.should.be.true();
                    done();
                });
            });
        });
    });
});
