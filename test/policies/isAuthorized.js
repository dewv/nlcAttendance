const http = require("http");
const status = require("http-status");
const querystring = require("querystring");
require("should");

const loginPath = "/login";

/**
 * Authenticates as a specified test user. 
 * @argument {string} role - The user role: `staff` or `student`. 
 * @argument {number} index - The `testRecords` array index of the test user. 
 * @argument {function} callback - The function to call on completion.
 */
function authenticateAs(role, index, callback) {
    let credentials = querystring.stringify({
        "username": sails.models[role].testRecords[index].username,
        "password": role
    });

    let options = {
        path: loginPath,
        port: 1337,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(credentials)
        }
    };

    let request = http.request(options, function (response) {
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
    let payload = querystring.stringify({
        "purpose": "This is required"
    });

    let options = {
        port: 1337,
        method: method,
        path: path,
        headers: {
            "Cookie": sessionCookie,
        }
    };

    if (method === "POST") {
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";
        options.headers["Content-Length"] = Buffer.byteLength(payload);
    }

    let request = http.request(options, function (response) {
        return callback(response.statusCode !== status.FORBIDDEN);
    });

    if (method === "POST") request.write(payload);
    request.end();
}

/**
 * Returns location of a redirected request, or `undefined` if request was not redirected. 
 * @argument {string} method - The HTTP method of the request.
 * @argument {string} path - The relative URL of the request.
 * @argument {function} callback - The function to call on completion.
 */
function redirectLocation(method, path, sessionCookie, callback) {
    let options = {
        port: 1337,
        method: method,
        path: path,
        headers: {
            "Cookie": sessionCookie
        }
    };

    let request = http.request(options, function (response) {
        return callback(response.statusCode === status.FOUND ? response.headers.location : undefined);
    });

    request.end();
}

describe("`isAuthorized` policy", function () {
    context("when the user is an authenticated student and a profile update is required", function () {
        let studentSession = undefined;
        let testRecordsIndex = 0;

        before(function (done) {
            authenticateAs("student", testRecordsIndex, function (cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should force an update to the student's profile by redirecting requests", function (done) {
            redirectLocation("GET", "/visit/new", studentSession, function (location) {
                location.should.equal(`/student/${testRecordsIndex + 1}/edit`);
                done();
            });
        });
    });

    context("when the user is an authenticated student and checked out", function () {
        let studentSession = undefined;
        let testRecordsIndex = 6;

        before(function (done) {
            authenticateAs("student", testRecordsIndex, function (cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should redirect most requests to the check in form", function (done) {
            let requests = [{
                method: "GET",
                url: `/student/${testRecordsIndex - 1}/edit`
            },
            {
                method: "POST",
                url: `/student/${testRecordsIndex - 1}`
            },
            {
                method: "GET",
                url: "/visit/15/edit"
            },
            {
                method: "POST",
                url: "/visit/15"
            },
            {
                method: "GET",
                url: "/visit/13/edit"
            },
            {
                method: "POST",
                url: "/visit/13"
            },
            {
                method: "GET",
                url: "/visit/10"
            },
            {
                method: "POST",
                url: "/visit/10"
            },
            {
                method: "GET",
                url: "/visit"
            },
            {
                method: "GET",
                url: "/browser"
            },
            {
                method: "GET",
                url: "/student"
            }
            ];

            let activeRequests = 0;
            for (let request in requests) {
                activeRequests++;
                redirectLocation(request.method, request.url, studentSession, function (location) {
                    location.should.equal("/visit/new");
                    if (--activeRequests === 0) return done();
                });
            }
        });

        it("should authorize requests to load their own profile in the edit form", function (done) {
            isRequestAuthorized("GET", `/student/${testRecordsIndex + 1}/edit`, studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function (done) {
            isRequestAuthorized("POST", `/student/${testRecordsIndex + 1}`, studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to load the visit create form", function (done) {
            isRequestAuthorized("GET", "/student/visit", studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        // This test is last because request forces logout.
        it("should authorize requests to submit the visit create form", function (done) {
            isRequestAuthorized("POST", "/visit", studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });
    });

    context("when the user is an authenticated student and checked in", function () {
        let studentSession = undefined;
        let testRecordsIndex = 7;

        before(function (done) {
            authenticateAs("student", testRecordsIndex, function (cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should redirect most requests to the check out form", function (done) {
            let requests = [{
                method: "GET",
                url: `/student/${testRecordsIndex - 1}/edit`
            },
            {
                method: "POST",
                url: `/student/${testRecordsIndex - 1}`
            },
            {
                method: "GET",
                url: "/visit/15/edit"
            },
            {
                method: "POST",
                url: "/visit/15"
            },
            {
                method: "GET",
                url: "/visit/13/edit"
            },
            {
                method: "POST",
                url: "/visit/13"
            },
            {
                method: "GET",
                url: "/visit/10"
            },
            {
                method: "POST",
                url: "/visit/10"
            },
            {
                method: "GET",
                url: "/visit"
            },
            {
                method: "GET",
                url: "/browser"
            },
            {
                method: "GET",
                url: "/student"
            },
            {
                method: "GET",
                url: "/visit/new"
            }
            ];

            let activeRequests = 0;
            for (let request in requests) {
                activeRequests++;
                redirectLocation(request.method, request.url, studentSession, function (location) {
                    location.should.equal("/visit/28/edit");
                    if (--activeRequests === 0) return done();
                });
            }
        });

        it("should authorize requests to load their own profile in the edit form", function (done) {
            isRequestAuthorized("GET", `/student/${testRecordsIndex + 1}/edit`, studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function (done) {
            isRequestAuthorized("POST", `/student/${testRecordsIndex + 1}`, studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });
        
        it("should authorize requests to load their own most recent visit in the edit form", function (done) {
            isRequestAuthorized("GET", "/visit/28/edit", studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        // This test is last because request forces logout.
        it("should authorize requests to update their own most recent visit", function (done) {
            isRequestAuthorized("POST", "/visit/28", studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });
    });

    context("when the user is authenticated student and has no visits", function () {
        let studentSession = undefined;
        let testRecordsIndex = 5;

        before(function (done) {
            authenticateAs("student", testRecordsIndex, function (cookie) {
                studentSession = cookie;
                done();
            });
        });

        it("should redirect most requests to the check in form", function (done) {
            let requests = [{
                method: "GET",
                url: `/student/${testRecordsIndex - 1}/edit`
            },
            {
                method: "POST",
                url: `/student/${testRecordsIndex - 1}`
            },
            {
                method: "GET",
                url: "/visit/15/edit"
            },
            {
                method: "POST",
                url: "/visit/15"
            },
            {
                method: "GET",
                url: "/visit/13/edit"
            },
            {
                method: "POST",
                url: "/visit/13"
            },
            {
                method: "GET",
                url: "/visit/10"
            },
            {
                method: "POST",
                url: "/visit/10"
            },
            {
                method: "GET",
                url: "/visit"
            },
            {
                method: "GET",
                url: "/browser"
            },
            {
                method: "GET",
                url: "/student"
            }
            ];

            let activeRequests = 0;
            for (let request in requests) {
                activeRequests++;
                redirectLocation(request.method, request.url, studentSession, function (location) {
                    location.should.equal("/visit/new");
                    if (--activeRequests === 0) return done();
                });
            }
        });

        it("should authorize requests to load their own profile in the edit form", function (done) {
            isRequestAuthorized("GET", `/student/${testRecordsIndex + 1}/edit`, studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function (done) {
            isRequestAuthorized("POST", `/student/${testRecordsIndex + 1}`, studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to load the visit create form", function (done) {
            isRequestAuthorized("GET", "/student/visit", studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        // This test is last because request forces logout.
        it("should authorize requests to submit the visit create form", function (done) {
            isRequestAuthorized("POST", "/visit", studentSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });
    });

    context("when the user is authenticated staff", function () {
        let staffSession = undefined;
        let testUserId = 5;

        before(function (done) {
            authenticateAs("staff", testUserId - 1, function (cookie) {
                staffSession = cookie;
                done();
            });
        });

        it("should authorize requests to load their own profile in the edit form", function (done) {
            isRequestAuthorized("GET", `/staff/${testUserId}/edit`, staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to update their own profile", function (done) {
            isRequestAuthorized("POST", `/staff/${testUserId}`, staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load other user profiles in the edit form", function (done) {
            isRequestAuthorized("GET", `/staff/${testUserId - 1}/edit`, staffSession, function (authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update other user profiles", function (done) {
            isRequestAuthorized("POST", `/staff/${testUserId - 1}`, staffSession, function (authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to get the staff menu", function (done) {
            isRequestAuthorized("GET", "/staffmenu", staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to view all visit records", function (done) {
            isRequestAuthorized("GET", "/visit", staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to load the browser registration form", function (done) {
            isRequestAuthorized("GET", "/browser", staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should forbid requests to load the visit create form", function (done) {
            isRequestAuthorized("GET", "/student/visit", staffSession, function (authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to submit the visit create form", function (done) {
            isRequestAuthorized("POST", "/visit", staffSession, function (authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to load the visit edit form", function (done) {
            isRequestAuthorized("GET", "/visit/3/edit", staffSession, function (authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should forbid requests to update visits", function (done) {
            isRequestAuthorized("POST", "/visit/3", staffSession, function (authorized) {
                authorized.should.be.false();
                done();
            });
        });

        it("should authorize requests to load the visit spreadsheet", function (done) {
            isRequestAuthorized("GET", "/visit", staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });

        it("should authorize requests to load the student spreadsheet", function (done) {
            isRequestAuthorized("GET", "/student", staffSession, function (authorized) {
                authorized.should.be.true();
                done();
            });
        });
    });
});
