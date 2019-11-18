const http = require("http");
const querystring = require("querystring");
require("should");

let restGets = [{
    url: "/controller-unit-test",
    handler: "listRequested"
}, {
    url: "/controller-unit-test/new",
    handler: "createFormRequested"
}, {
    url: "/controller-unit-test/0/edit",
    handler: "editFormRequested"
}];

let getOptions = {
    port: 1337,
    method: "GET"
};

let restPosts = [{
    url: "/controller-unit-test",
    handler: "createFormSubmitted"
}, {
    url: "/controller-unit-test/0",
    handler: "editFormSubmitted"
}];

let postData = querystring.stringify({
    "action": "testing"
});

let postOptions = {
    port: 1337,
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
    }
};

describe("RESTful requests", function() {
    let testsRunning = restGets.length + restPosts.length;
    
    it("should be directed to the appropriate `RestController` method", function(done) {
        for (let restGet of restGets) {
            getOptions.path = restGet.url;
            let request = http.request(getOptions, function(response) {
                response.headers["set-cookie"].indexOf(`RestController=${restGet.handler}; Path=/`).should.be.greaterThanOrEqual(0);
                if (--testsRunning === 0)  return done();
            });
            request.end();
        }

        for (let restPost of restPosts) {
            postOptions.path = restPost.url;
            let request = http.request(postOptions, function(response) {
                response.headers["set-cookie"].indexOf(`RestController=${restPost.handler}; Path=/`).should.be.greaterThanOrEqual(0);
                if (--testsRunning === 0)  return done();
            });
            request.write(postData);
            request.end();
        }
    });    
});
