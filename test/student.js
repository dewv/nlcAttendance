const should = require("should");
const CheckHTTP = require("./CheckHTTP");
const CheckHTML = require("./CheckHTML");

// Expected responses.
const ok = { statusCode: 200 };
const forbidden = { statusCode: 403 };
const redirect = { statusCode: 302 };

const service = "/student";

describe(`${service} routes`, function () {
    let options = {
        userRole: "student",
        userId: 5
    };

    let checkHTTP = new CheckHTTP();

    context("when the user is staff", function () {
        let options = {
            userRole: "staff",
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

    context("when the user is a student", function () {
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
            before(async function () {
                // ... GET the update form ...
                let responseBody = await checkHTTP.roundTrip("GET", `${service}/${options.userId}/edit`, options, ok);
                // ... parse the HTML for checking ...
                checkHTML = new CheckHTML(responseBody);
                // ... and find the database record.
                record = await Student.findOne({ id: options.userId });
                should.exist(record);
            });

            context("should ok getting the update form", function () {
                it("should include TODO"
                    // Verify form data matches database record.
                );

                it("should include a button to submit the form", function () {
                    checkHTML.hasFormButton("submitButton").should.be.true();
                });
            });

            context("should redirect to check in or out afer posting update data", function () {
                // Isolate options changes to this context block.
                let _options = {};

                before(async function () {
                    // Setup POST payload to change database contents.
                    Object.assign(_options, options);
                    _options.payload = {
                        id: _options.userId,
                        academicRank: "Sophomore",
                        residentialStatus: "Commuter",
                        majorOne: "Accounting",
                        majorTwo: "Adventure Recreation",
                        sportOne: "Men's Basketball",
                        sportTwo: "Men's Cross Country",
                        slpInstructor: "STAFFFIRSTNAME1 STAFFLASTNAME1"
                    };

                    // Make the request.
                    await checkHTTP.roundTrip("POST", `${service}/${_options.userId}`, _options, redirect);
                });

                it("should update database", async function () {
                    // Find the (updated) database record
                    let updatedRecord = await Student.findOne({ id: _options.userId })
                        .populate("majorOne")
                        .populate("majorTwo")
                        .populate("sportOne")
                        .populate("sportTwo")
                        .populate("slpInstructor");

                    should.exist(updatedRecord);

                    // Verify it matches POST payload.
                    for (let property in _options.payload) {
                        if (typeof updatedRecord[property] === "object") {
                            updatedRecord[property].name.should.equal(_options.payload[property]);
                        }
                        else {
                            updatedRecord[property].should.equal(_options.payload[property]);
                        }
                    }
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
