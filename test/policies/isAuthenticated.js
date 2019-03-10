const http = require("http");
const status = require("http-status");
const querystring = require("querystring");
require("should");

const loginPath = "/login";

let postUrls = [
    "/visit",
    "/visit/0",
    "/student/0",
    "/staff/0"
];

let getUrls = [
    "/visit",
    "/visit/0/edit",
    "/student/0/edit",
    "/staff/0/edit",
    "/visit/new",
    "/staffmenu",
    "/browser"
];

// This is valid test login credentials.
// POSTing to login URL will successfully authenticate.
// For all other POSTs it's just arbitrary payload.
let postData = querystring.stringify({
    "username": "TESTUSER@DEWV.NET",
    "password": "student"
});

let postOptions = {
    port: 8080,
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
    }
};

let getOptions = {
    port: 8080,
    method: "GET"
};

describe("`isAuthenticated` policy", function() {
    it("should complete unauthenticated requests for `/login`", function() {
        getOptions.path = loginPath;
        let request = http.request(getOptions, function(response) {
            response.statusCode.should.equal(status.OK);
        });
        request.end();

        postOptions.path = loginPath;
        request = http.request(postOptions, function(response) {
            response.statusCode.should.equal(status.FOUND);
            response.headers.location.should.equal("/");
        });
        request.write(postData);
        request.end();
    });

    it("should redirect all other unauthenticated requests to `/login`", function() {
        for (let url of getUrls) {
            getOptions.path = url;
            let request = http.request(getOptions, function(response) {
                response.statusCode.should.equal(status.FOUND);
                response.headers.location.should.equal(loginPath);
            });
            request.end();
        }

        for (let url of postUrls) {
            postOptions.path = url;
            let request = http.request(postOptions, function(response) {
                response.statusCode.should.equal(status.FOUND);
                response.headers.location.should.equal(loginPath);
            });
            request.write(postData);
            request.end();
        }
    });
});
