const CheckHTTP = require("./CheckHTTP");
const CheckHTML = require("./CheckHTML");

// Expected responses.
const ok = { statusCode: 200 };
const forbidden = { statusCode: 403 };
const redirect = { statusCode: 302 };

testAuthentication("/login");
testAuthentication("/logout");

function testAuthentication(service) {
    describe(`${service} routes`, function () {

        context("when the user is staff", function () {
            it("should destroy their session and display the login form");
        });

        context("when the user is a student", function () {
            it("should destroy their session and display the login form");
        });

        context("when the user is not authenticated", function () {
            it("should display the login form");
        });
    });
}
