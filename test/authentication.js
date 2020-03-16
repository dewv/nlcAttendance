const CheckHTTP = require("./CheckHTTP");
const CheckHTML = require("./CheckHTML");

// Expected responses.
const ok = { statusCode: 200 };
const forbidden = { statusCode: 403 };
const redirect = { statusCode: 302 };

testAuthentication("/login");
testAuthentication("/logout");

let checkHTTP = new CheckHTTP();

function testAuthentication(service) {
    describe(`${service} routes`, function () {

        context("when the user is staff", function () {
            let options = {
                    userRole: "staff",
                    userId: 5
                };
            it("should destroy their session and display the login form", function() {
                checkHTTP.roundTrip("GET", `${service}/`, options, forbidden);
            });
        });

        context("when the user is a student", function () {
            let options = {
                    userRole: "student",
                    userId: 5
            };
            it("should destroy their session and display the login form", function() {
                checkHTTP.roundTrip("GET", `${service}/`, options, forbidden);
            });
        });

        context("when the user is not authenticated", function () {
            let options = {
                userRole: undefined,
                userId: 5
            };
            it("should display the login form", function() {
                checkHTTP.roundTrip("GET", `${service}/`, options, redirect);
            });
        });
    });
}
