const should = require("should");
const CheckHTTP = require("./CheckHTTP");

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
            recordId: 1
        };

        let checkHTTP = new CheckHTTP();

        context("when the user is staff", function () {
            context("allow creating records", function () {
                it("should ok getting the create form", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/new`, options, ok);
                });

                it("should redirect to the records list after posting create data", async function () {
                    // Isolate options changes to this block.
                    let _options = {};
                    Object.assign(_options, options);
                    _options.payload = { name: "NEW TEST LOOKUP RECORD", discontinued: "No" };
                    await checkHTTP.roundTrip("POST", `${service}`, _options, listRedirect);
                });
            });

            context("allow some ways of reading records", function () {
                it("should ok getting records list", async function () {
                    await checkHTTP.roundTrip("GET", `${service}`, options, ok);
                });

                it("should forbid getting specific records", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/${options.recordId}`, options, forbidden);
                });
            });

            context("allow updating records directly from list", function () {
                let record;

                // Before this block of tests ...
                before(async function () {
                    // ... find the database record.
                    record = await sails.models[service.substring(1)].findOne({ id: options.recordId });
                    should.exist(record);
                });

                it("should forbid getting the update form", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/${options.recordId}/edit`, options, forbidden);
                });

                context("should redirect to the records list after posting update data", function () {
                    // Isolate options changes to this context block.
                    let _options = {};

                    before(async function () {
                        // Setup POST payload to change database contents.
                        Object.assign(_options, options);
                        _options.payload = { id: _options.recordId, discontinued: record.discontinued === "Yes" ? "No" : "Yes" };

                        // Make the request.
                        await checkHTTP.roundTrip("POST", `${service}/${_options.recordId}`, _options, listRedirect);
                    });

                    it("should update database", async function () {
                        // Find the (updated) database record and verify it matches POST payload.
                        let updatedRecord = await sails.models[service.substring(1)].findOne({ id: _options.recordId });
                        should.exist(updatedRecord);
                        updatedRecord.discontinued.should.equal(_options.payload.discontinued);
                    });
                });
            });
        });

        it("should forbid requests to delete records", async function () {
            await checkHTTP.roundTrip("POST", `${service}/${options.recordId}/delete`, options, forbidden);
        });

        context("when the user is a student", function () {
            let options = {
                userRole: "student",
                userId: 5,
                recordId: 1
            };

            context("prevent creating records", function () {
                it("should forbid getting the create form", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/new`, options, forbidden);
                });

                it("should forbid posting create data", async function () {
                    await checkHTTP.roundTrip("POST", `${service}`, options, forbidden);
                });
            });

            context("prevent reading records", function () {
                it("should forbid getting records list", async function () {
                    await checkHTTP.roundTrip("GET", `${service}`, options, forbidden);
                });

                it("should forbid getting specific records", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/${options.recordId}`, options, forbidden);
                });
            });

            context("prevent updating records", function () {
                it("should forbid getting the update form", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/${options.recordId}/edit`, options, forbidden);
                });

                it("should forbid posting update data", async function () {
                    await checkHTTP.roundTrip("POST", `${service}/${options.recordId}`, options, forbidden);
                });
            });

            it("should forbid requests to delete records", async function () {
                await checkHTTP.roundTrip("POST", `${service}/${options.recordId}/delete`, options, forbidden);
            });
        });

        context("when the user is not authenticated", function () {
            let options = {
                userRole: undefined,
                userId: 5,
                recordId: 1
            };

            let loginRedirect = {
                statusCode: redirect.statusCode,
                location: "/login"
            };

            context("prevent creating records", function () {
                it("should redirect to /login instead of getting the create form", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/new`, options, loginRedirect);
                });

                it("should redirect to /login instead of posting create data", async function () {
                    await checkHTTP.roundTrip("POST", `${service}`, options, loginRedirect);
                });
            });

            context("prevent reading records", function () {
                it("should redirect to /login instead of getting records list", async function () {
                    await checkHTTP.roundTrip("GET", `${service}`, options, loginRedirect);
                });

                it("should forbid getting specific records", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/${options.recordId}`, options, forbidden);
                });
            });

            context("prevent updating records", function () {
                it("should forbid getting the update form", async function () {
                    await checkHTTP.roundTrip("GET", `${service}/${options.recordId}/edit`, options, forbidden);
                });

                it("should redirect to /login instead of posting update data", async function () {
                    await checkHTTP.roundTrip("POST", `${service}/${options.recordId}`, options, loginRedirect);
                });
            });

            it("should forbid requests to delete records", async function () {
                await checkHTTP.roundTrip("POST", `${service}/${options.recordId}/delete`, options, forbidden);
            });
        });
    });
}
