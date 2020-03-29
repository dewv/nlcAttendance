const CheckHTTP = require("./CheckHTTP");
const CheckHTML = require("./CheckHTML");

// Expected responses.
const ok = { statusCode: 200 };
const forbidden = { statusCode: 403 };
const redirect = { statusCode: 302 };

const service = "/staff";

describe(`${service} routes`, function () {
    let options = {
        userRole: "staff",
        userId: 5
    };

    let checkHTTP = new CheckHTTP();

    context("when the user is staff", function () {
        context("prevent creating records", function () {
            it("should forbid getting the create form", function () {
                checkHTTP.roundTrip("GET", `${service}/new`, options, forbidden);
            });

            it("should forbid posting create data", function () {
                checkHTTP.roundTrip("POST", `${service}`, options, forbidden);
            });
        });

        context("prevent reading records", function () {
            it("should forbid getting records list", function () {
                checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
            });

            it("should forbid getting specific records", function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}`, options, forbidden);
            });
        });

        context("allow updating the user's own record", function () {
            let record;
            let checkHTML;

            // Before this block of tests ...
            before(function (done) {
                // ... GET the update form ...
                checkHTTP.roundTrip("GET", `${service}/${options.userId}/edit`, options, ok, async function (responseBody) {
                    // ... parse the HTML for checking ...
                    checkHTML = new CheckHTML(responseBody);
                    // ... and find the database record.
                    record = await Staff.findOne({ id: options.userId });
                    should.exist(record);
                    done();
                });
            });

            context("should ok getting the update form", function () {
                it("should include options to select SLP instructor status", function () {
                    // Verify form data matches database record.
                    let isSlpInstructor = record.isSlpInstructor ? "true" : "false";
                    checkHTML.hasFormSelectOption("isSlpInstructor", isSlpInstructor).should.be.true();
                });

                it("should include a button to submit the form", function () {
                    checkHTML.hasFormButton("submitButton").should.be.true();
                });
            });

            context("should redirect to the Visits list after posting update data", function () {
<<<<<<< HEAD
                // Isolate options changes to this context block.
=======
                // Isolate options changes to this context block.
>>>>>>> 74a575e75f97804d37ce91f67907472239f8bb07
                let _options = {};

                before(function (done) {
                    // Setup POST payload to change database contents.
                    Object.assign(_options, options);
                    _options.payload = { id: _options.userId, isSlpInstructor: !record.isSlpInstructor };

                    // Setup expected redirect response.
                    let visitRedirect = {
                        statusCode: redirect.statusCode,
                        location: "/visit"
                    };

                    // Make the request.
                    checkHTTP.roundTrip("POST", `${service}/${_options.userId}`, _options, visitRedirect, function () { done(); });
                });

                it("should update database", async function () {
                    // Find the (updated) database record and verify it matches POST payload.
                    let updatedRecord = await Staff.findOne({ id: _options.userId });
                    should.exist(updatedRecord);
                    updatedRecord.isSlpInstructor.should.equal(_options.payload.isSlpInstructor);
                });
            });
        });

        context("prevent updating other users' records", function () {
            it("should forbid getting the update form", function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId + 1}/edit`, options, forbidden);
            });

            it("should forbid posting update data", function () {
                checkHTTP.roundTrip("POST", `${service}/${options.userId + 1}`, options, forbidden);
            });
        });

        it("should forbid requests to delete records", function () {
            checkHTTP.roundTrip("POST", `${service}/${options.userId}/delete`, options, forbidden);
        });
    });

    context("when the user is a student", function () {
        let options = {
            userRole: "student",
            userId: 5
        };

        context("prevent creating records", function () {
            it("should forbid getting the create form", function () {
                checkHTTP.roundTrip("GET", `${service}/new`, options, forbidden);
            });

            it("should forbid posting create data", function () {
                checkHTTP.roundTrip("POST", `${service}`, options, forbidden);
            });
        });

        context("prevent reading records", function () {
            it("should forbid getting records list", function () {
                checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
            });

            it("should forbid getting specific records", function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}`, options, forbidden);
            });
        });

        context("prevent updating records", function () {
            it("should forbid getting the update form", function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}/edit`, options, forbidden);
            });

            it("should forbid posting update data", function () {
                checkHTTP.roundTrip("POST", `${service}/${options.userId}`, options, forbidden);
            });
        });

        it("should forbid requests to delete records", function () {
            checkHTTP.roundTrip("POST", `${service}/${options.userId}/delete`, options, forbidden);
        });
    });

    context("when the user is not authenticated", function () {
        let options = {
            userRole: undefined,
            userId: 5
        };

        context("prevent creating records", function () {
            it("should forbid getting the create form", function () {
                checkHTTP.roundTrip("GET", `${service}/new`, options, forbidden);
            });

            it("should forbid posting create data", function () {
                checkHTTP.roundTrip("POST", `${service}`, options, forbidden);
            });
        });

        context("prevent reading records", function () {
            it("should forbid getting records list", function () {
                checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
            });

            it("should forbid getting specific records", function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}`, options, forbidden);
            });
        });

        context("require authentication in order to authorize updating records", function () {
            let loginRedirect = {
                statusCode: redirect.statusCode,
                location: "/login"
            };

            it("should redirect to /login instead of getting the update form", function () {
                checkHTTP.roundTrip("GET", `${service}/${options.userId}/edit`, options, loginRedirect);
            });

            it("should redirect to /login instead of posting update data", function () {
                checkHTTP.roundTrip("POST", `${service}/${options.userId}`, options, loginRedirect);
            });
        });

        it("should forbid requests to delete records", function () {
            checkHTTP.roundTrip("POST", `${service}/${options.userId}/delete`, options, forbidden);
        });
    });
});
