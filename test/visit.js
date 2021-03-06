const CheckHTTP = require("./CheckHTTP");
// const CheckHTML = require("./CheckHTML");

// Expected responses.
const ok = { statusCode: 200 };
const forbidden = { statusCode: 403 };
// const redirect = { statusCode: 302 };

const service = "/visit";

describe(`${service} routes`, function () {

    let checkHTTP = new CheckHTTP();

    context("when the user is a student", function () {
        let options = {
            userRole: "student",
            userId: 5
        };

        // Use a valid visit id. It IS for student with userId 5: a slightly better test since requests should generally not go thru.
        let visitId = 10;

        context("a database flag may require a profile update by redirecting all permissable requests", function () {
            it("should redirect to the profile update form instead of getting the create form");
            it("should redirect to the profile update form instead of posting create data");
            it("should redirect to the profile update form instead of getting the update form");
            it("should redirect posting update data");

            it("should forbid getting records list", async function () {
                await checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
            });

            it("should forbid downloading records list", async function () {
                await checkHTTP.roundTrip("GET", `${service}/download`, options, forbidden);
            });

            it("should forbid getting specific records", async function () {
                await checkHTTP.roundTrip("GET", `${service}/${visitId}`, options, forbidden);
            });

            it("should forbid requests to delete records", async function () {
                await checkHTTP.roundTrip("POST", `${service}/${visitId}/delete`, options, forbidden);
            });
        });

        context("who is currently checked out", function () {
            it("should allow getting the create form");
            it("should redirect to /logout after posting create data");
            it("should redirect to the create form instead of getting the update form");
            it("should redirect to the create form instead of posting update data");

            it("should forbid getting records list", async function () {
                await checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
            });

            it("should forbid downloading records list", async function () {
                await checkHTTP.roundTrip("GET", `${service}/download`, options, forbidden);
            });

            it("should forbid getting specific records", async function () {
                await checkHTTP.roundTrip("GET", `${service}/${visitId}`, options, forbidden);
            });

            it("should forbid requests to delete records", async function () {
                await checkHTTP.roundTrip("POST", `${service}/${visitId}/delete`, options, forbidden);
            });
        });

        context("who is currently checked in", function () {
            it("should redirect to the update form instead of getting the create form");
            it("should redirect to the update form instead of posting create data");
            it("should allow getting the update form");
            it("should redirect to /logout after posting update data");

            it("should forbid getting records list", async function () {
                await checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
            });

            it("should forbid downloading records list", async function () {
                await checkHTTP.roundTrip("GET", `${service}/download`, options, forbidden);
            });

            it("should forbid getting specific records", async function () {
                await checkHTTP.roundTrip("GET", `${service}/${visitId}`, options, forbidden);
            });

            it("should forbid requests to delete records", async function () {
                await checkHTTP.roundTrip("POST", `${service}/${visitId}/delete`, options, forbidden);
            });
        });
    });

    context("when the user is staff", function () {
        let options = {
            userRole: "staff",
            userId: 5
        };

        // Use any valid visit ID. They aren't associated with staff anyway.
        let visitId = 1;

        it("should forbid getting the create form", async function () {
            await checkHTTP.roundTrip("GET", `${service}/new`, options, forbidden);
        });

        it("should forbid posting create data", async function () {
            await checkHTTP.roundTrip("POST", `${service}`, options, forbidden);
        });

        it("should forbid getting the update form", async function () {
            await checkHTTP.roundTrip("GET", `${service}/${visitId}/edit`, options, forbidden);
        });

        it("should forbid posting update data", async function () {
            await checkHTTP.roundTrip("POST", `${service}/${visitId}`, options, forbidden);
        });

        it("should allow getting records list", async function () {
            await checkHTTP.roundTrip("GET", `${service}`, options, ok);
        });

        it("should allow downloading records list", async function () {
            await checkHTTP.roundTrip("GET", `${service}/download`, options, ok);
        });

        it("should forbid getting specific records", async function () {
            await checkHTTP.roundTrip("GET", `${service}/${visitId}`, options, forbidden);
        });

        it("should forbid requests to delete records", async function () {
            await checkHTTP.roundTrip("POST", `${service}/${visitId}/delete`, options, forbidden);
        });
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
