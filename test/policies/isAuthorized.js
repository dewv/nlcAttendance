const http = require("http");
const status = require("http-status");
const querystring = require("querystring");
require("should");

const loginPath = "/login";

function authenticateAs(role, id, callback) {
    let credentials = querystring.stringify({
        "username": sails.models[role].testRecords[id].username,
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
    context("when the user is an authenticated student and checked out", function() {
        let studentSession = undefined;

        before(function(done) {
            authenticateAs("student", 6, function(cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/7/edit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function(done) {
            isRequestAuthorized("POST", "/student/7", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user profiles in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/3/edit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user profiles", function(done) {
            isRequestAuthorized("POST", "/student/3", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to load the visit create form", function(done) {
            isRequestAuthorized("GET", "/visit/new", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to submit the visit create form", function(done) {
            isRequestAuthorized("POST", "/visit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load their own most recent visit in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/15/edit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update their own most recent visit", function(done) {
            isRequestAuthorized("POST", "/visit/15", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load their older visits in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/13/edit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update their older visits", function(done) {
            isRequestAuthorized("POST", "/visit/13", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load other user's visits in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/10", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user's visits", function(done) {
            isRequestAuthorized("POST", "/visit/10", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to get the staff menu", function(done) {
            isRequestAuthorized("GET", "/staffmenu", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to view all visit records", function(done) {
            isRequestAuthorized("GET", "/visit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the browser registration form", function(done) {
            isRequestAuthorized("GET", "/browser", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to submit the browser registration form", function(done) {
            isRequestAuthorized("POST", "/browser", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the visit spreadsheet", function(done) {
            isRequestAuthorized("GET", "/visit/spreadsheet", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });
    });

    context("when the user is an authenticated student and checked in", function() {
        let studentSession = undefined;

        before(function(done) {
            authenticateAs("student", 7, function(cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/8/edit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function(done) {
            isRequestAuthorized("POST", "/student/8", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user profiles in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/3/edit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user profiles", function(done) {
            isRequestAuthorized("POST", "/student/3", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the visit create form", function(done) {
            isRequestAuthorized("GET", "/vist/new", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to submit the visit create form", function(done) {
            isRequestAuthorized("POST", "/visit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to load their own most recent visit in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/28/edit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own most recent visit", function(done) {
            isRequestAuthorized("POST", "/visit/28", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load their older visits in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/18/edit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update their older visits", function(done) {
            isRequestAuthorized("POST", "/visit/18", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load other user's visits in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/10", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user's visits", function(done) {
            isRequestAuthorized("POST", "/visit/10", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to get the staff menu", function(done) {
            isRequestAuthorized("GET", "/staffmenu", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to view all visit records", function(done) {
            isRequestAuthorized("GET", "/visit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the browser registration form", function(done) {
            isRequestAuthorized("GET", "/browser", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to submit the browser registration form", function(done) {
            isRequestAuthorized("POST", "/browser", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the visit spreadsheet", function(done) {
            isRequestAuthorized("GET", "/visit/spreadsheet", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });
    });

    context("when the user is authenticated student and has no visits", function() {
        let studentSession = undefined;

        before(function(done) {
            authenticateAs("student", 5, function(cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/6/edit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function(done) {
            isRequestAuthorized("POST", "/student/6", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user profiles in the edit form", function(done) {
            isRequestAuthorized("GET", "/student/3/edit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user profiles", function(done) {
            isRequestAuthorized("POST", "/student/3", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to load the visit create form", function(done) {
            isRequestAuthorized("GET", "/visit/new", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to submit the visit create form", function(done) {
            isRequestAuthorized("POST", "/visit", studentSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user's visits in the edit form", function(done) {
            isRequestAuthorized("GET", "/visit/10", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user's visits", function(done) {
            isRequestAuthorized("POST", "/visit/10", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to get the staff menu", function(done) {
            isRequestAuthorized("GET", "/staffmenu", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to view all visit records", function(done) {
            isRequestAuthorized("GET", "/visit", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the browser registration form", function(done) {
            isRequestAuthorized("GET", "/browser", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to submit the browser registration form", function(done) {
            isRequestAuthorized("POST", "/browser", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the visit spreadsheet", function(done) {
            isRequestAuthorized("GET", "/visit/spreadsheet", studentSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });
    });

    context("when the user is authenticated staff", function() {
        let staffSession = undefined;

        before(function(done) {
            authenticateAs("staff", 1, function(cookie) {
                staffSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form", function(done) {
            isRequestAuthorized("GET", "/staff/2/edit", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function(done) {
            isRequestAuthorized("POST", "/staff/2", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user profiles in the edit form", function(done) {
            isRequestAuthorized("GET", "/staff/3/edit", staffSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user profiles", function(done) {
            isRequestAuthorized("POST", "/staff/4", staffSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to get the staff menu", function(done) {
            isRequestAuthorized("GET", "/staffmenu", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to view all visit records", function(done) {
            isRequestAuthorized("GET", "/visit", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to load the browser registration form", function(done) {
            isRequestAuthorized("GET", "/browser", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to submit the browser registration form", function(done) {
            isRequestAuthorized("POST", "/browser", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load the visit create form", function(done) {
            isRequestAuthorized("GET", "/visit/new", staffSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to submit the visit create form", function(done) {
            isRequestAuthorized("POST", "/visit", staffSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the visit edit form", function(done) {
            isRequestAuthorized("GET", "/visit/3/edit", staffSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update visits", function(done) {
            isRequestAuthorized("POST", "/visit/3", staffSession, function(authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to load the visit spreadsheet"/*, function(done) {
            isRequestAuthorized("GET", "/visit/spreadsheet", staffSession, function(authorized) {
                authorized.should.be.true();
                done();
            });
        }*/);
    });
});
