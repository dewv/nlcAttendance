const CheckHTTP = require("./CheckHTTP");
const CheckHTML = require("./CheckHTML");

testLookupService("/major");
testLookupService("/sport");

function testLookupService(service) {
    // Expected responses.
    const ok = { statusCode: 200 };
    const forbidden = { statusCode: 403 };
    const redirect = { statusCode: 302 };

    // Some POSTs result in redirect to records list. 
    let listRedirect = {
        statusCode: redirect.statusCode,
        location: `${service}`
    };

    describe(`${service} routes`, function () {
        let options = {
            userRole: "staff",
            userId: 5,
            majorId: 1
        };

        let checkHTTP = new CheckHTTP();

        context("when the user is staff", function () {
            context("allow creating records", function () {
                it("should ok getting the create form", function () {
                    checkHTTP.roundTrip("GET", `${service}/new`, options, ok);
                });

                it("should redirect to the records list after posting create data", function () {
                    // Isolate options changes to this block. 
                    let _options = {};
                    Object.assign(_options, options);
                    _options.payload = { name: "NEW TEST MAJOR", discontinued: "No" };
                    checkHTTP.roundTrip("POST", `${service}`, _options, listRedirect);
                });
            });

            context("allow some ways of reading records", function () {
                it("should ok getting records list", function () {
                    checkHTTP.roundTrip("GET", `${service}`, options, ok);
                });

                it("should forbid getting specific records", function () {
                    checkHTTP.roundTrip("GET", `${service}/${options.majorId}`, options, forbidden);
                });
            });

            context("allow updating records directly from list", function () {
                let record;

                // Before this block of tests ...
                before(function (done) {
                    // ... find the database record.
                    record = { id: 1, name: "TESTING", discontinued: "Yes" } //await Major.findOne({ id: options.majorId });
                    should.exist(record);
                    done();
                });

                it("should forbid getting the update form", function () {
                    checkHTTP.roundTrip("GET", `${service}/${options.majorId}/edit`, options, forbidden);
                });

                context("should redirect to the records list after posting update data", function () {
                    // Isolate options changes to this context block. 
                    let _options = {};

                    before(function (done) {
                        // Setup POST payload to change database contents.
                        Object.assign(_options, options);
                        _options.payload = { id: _options.majorId, discontinued: record.discontinued === "Yes" ? "No" : "Yes" };

                        // Make the request.
                        checkHTTP.roundTrip("POST", `${service}/${_options.majorId}`, _options, listRedirect, function () { done(); });
                    });

                    it("should update database", async function () {
                        // Find the (updated) database record and verify it matches POST payload.
                        let updatedRecord = await Major.findOne({ id: _options.majorId });
                        should.exist(updatedRecord);
                        updatedRecord.discontinued.should.equal(_options.payload.discontinued);
                    });
                });
            });
        });

        it("should forbid requests to delete records", function () {
            checkHTTP.roundTrip("POST", `${service}/${options.majorId}/delete`, options, forbidden);
        });

        context("when the user is a student", function () {
            let options = {
                userRole: "student",
                userId: 5,
                majorId: 1
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
                    checkHTTP.roundTrip("GET", `${service}/${options.majorId}`, options, forbidden);
                });
            });

            context("prevent updating records", function () {
                it("should forbid getting the update form", function () {
                    checkHTTP.roundTrip("GET", `${service}/${options.majorId}/edit`, options, forbidden);
                });

                it("should forbid posting update data", function () {
                    checkHTTP.roundTrip("POST", `${service}/${options.majorId}`, options, forbidden);
                });
            });

            it("should forbid requests to delete records", function () {
                checkHTTP.roundTrip("POST", `${service}/${options.majorId}/delete`, options, forbidden);
            });
        });

        context("when the user is not authenticated", function () {
            let options = {
                userRole: undefined,
                userId: 5,
                majorId: 1
            };

            let loginRedirect = {
                statusCode: redirect.statusCode,
                location: "/login"
            };

            context("prevent creating records", function () {
                it("should redirect to /login instead of getting the create form", function () {
                    checkHTTP.roundTrip("GET", `${service}/new`, options, loginRedirect);
                });

                it("should redirect to /login instead of posting create data", function () {
                    checkHTTP.roundTrip("POST", `${service}`, options, loginRedirect);
                });
            });

            context("prevent reading records", function () {
                it("should redirect to /login instead of getting records list", function () {
                    checkHTTP.roundTrip("GET", `${service}`, options, loginRedirect);
                });

                it("should forbid getting specific records", function () {
                    checkHTTP.roundTrip("GET", `${service}/${options.majorId}`, options, forbidden);
                });
            });

            context("prevent updating records", function () {
                it("should forbid getting the update form", function () {
                    checkHTTP.roundTrip("GET", `${service}/${options.majorId}/edit`, options, forbidden);
                });

                it("should redirect to /login instead of posting update data", function () {
                    checkHTTP.roundTrip("POST", `${service}/${options.majorId}`, options, loginRedirect);
                });
            });

            it("should forbid requests to delete records", function () {
                checkHTTP.roundTrip("POST", `${service}/${options.majorId}/delete`, options, forbidden);
            });
        });
    });
}
