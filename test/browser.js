// const CheckHTTP = require("./CheckHTTP");
// const CheckHTML = require("./CheckHTML");

// Expected responses.
// const ok = { statusCode: 200 };
// const forbidden = { statusCode: 403 };
// const redirect = { statusCode: 302 };

const service = "/browser";

describe(`${service} routes`, function () {
    context("when the user is staff", function () {
        it("should ok getting the registration form");
    });

    context("when the user is a student", function () {
        it("should forbid getting the registration form");
    });

    context("when the user is not authenticated", function () {
        it("should redirect to /login instead of getting the registration form");
    });
});
