const CheckHTTP = require("./CheckHTTP");
const CheckHTML = require("./CheckHTML");

// Expected responses.
const ok = { statusCode: 200 };
const forbidden = { statusCode: 403 };
const redirect = { statusCode: 302 };

const service = "/visit";

describe(`${service} routes`, function () {

    let checkHTTP = new CheckHTTP();

    context("when the user is a student", function () {
        let options = {
        userRole: "student",
        userId: 5
    };
        context("a database flag may require a profile update by redirecting all permissable requests", function () {
            it("should redirect to the profile update form instead of getting the create form");
            it("should redirect to the profile update form instead of posting create data");
            it("should redirect to the profile update form instead of getting the update form");
            it("should redirect posting update data");
            it("should forbid getting records list"), function () {
                checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
             };
            it("should forbid downloading records list"), function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}/download`, options, forbidden);
             };
            it("should forbid getting specific records"), function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}`, options, forbidden);
             };
            it("should forbid requests to delete records"), function () {
                checkHTTP.roundTrip("POST", `${service}/${options.userId}/delete`, options, forbidden);
             };
        });

        context("who is currently checked out", function () {
            it("should allow getting the create form");
            it("should redirect to /logout after posting create data");
            it("should redirect to the create form instead of getting the update form");
            it("should redirect to the create form instead of posting update data");
            it("should forbid getting records list"), function () {
                checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
             };
            it("should forbid downloading records list"), function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}/download`, options, forbidden);
             };
            it("should forbid getting specific records"), function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}`, options, forbidden);
             };
            it("should forbid requests to delete records"), function () {
                checkHTTP.roundTrip("POST", `${service}/${options.userId}/delete`, options, forbidden);
             };
        });

        context("who is currently checked in", function () {
            it("should redirect to the update form instead of getting the create form");
            it("should redirect to the update form instead of posting create data");
            it("should allow getting the update form");
            it("should redirect to /logout after posting update data");
            it("should forbid getting records list"), function () {
                checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
             };
            it("should forbid downloading records list"), function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}/download`, options, forbidden);
             };
            it("should forbid getting specific records"), function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}`, options, forbidden);
             };
            it("should forbid requests to delete records"), function () {
                checkHTTP.roundTrip("POST", `${service}/${options.userId}/delete`, options, forbidden);
             };
        });
    });

    context("when the user is staff", function () {
        it("should forbid getting the create form");
        it("should forbid posting create data");
        it("should forbid getting the update form");
        it("should forbid posting update data");
        it("should allow getting records list");
        it("should allow downloading records list");
        it("should forbid getting specific records");
        it("should forbid requests to delete records");
    });

    context("when the user is not authenticated", function () {
        it("should redirect to /login instead of getting the create form");
        it("should redirect to /login instead of posting create data");
        it("should redirect to /login instead of getting the update form");
        it("should redirect to /login instead of posting update data");
        it("should redirect to /login instead of getting records list");
        it("should redirect to /login instead of downloading records list");
        it("should forbid getting specific records");
        it("should forbid requests to delete records");
    });
});
