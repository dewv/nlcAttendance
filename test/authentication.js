const CheckHTTP = require("./CheckHTTP");

// Expected responses.
const ok = { statusCode: 200 };

testAuthentication("/login");
testAuthentication("/logout");

let checkHTTP = new CheckHTTP();

function testAuthentication(service) {
    describe(`${service} route`, function () {

        context("when the user is staff", function () {
            let options = {
                userRole: "staff",
                userId: 5
            };

            it("should destroy their session and display the login form", async function () {
                await checkHTTP.roundTrip("GET", "/login", options, ok);
            });
        });

        context("when the user is a student", function () {
            let options = {
                userRole: "student",
                userId: 5
            };

            it("should destroy their session and display the login form", async function () {
                await checkHTTP.roundTrip("GET", "/login", options, ok);
            });
        });

        context("when the user is not authenticated", function () {
            let options = {
                userRole: undefined,
                userId: 5
            };

            it("should display the login form", async function () {
                await checkHTTP.roundTrip("GET", "/login", options, ok);
            });
        });
    });
}
