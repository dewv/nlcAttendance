require("should");
const MockExpressRequest = require("mock-express-request");
const MockExpressResponse = require("mock-express-response");
const ViewTests = require("../furlsails/test/Views");
const studentViews = require("../studentViews");

describe("Student views", function() {

    context("The edit form", function(done) {
        let request = new MockExpressRequest({
            baseUrl: studentViews.baseUrl + "/0/edit"
        });

        let response = new MockExpressResponse();

        let expectedData = {
            id: 0,
            username: "testuser@dewv.net",
            firstName: "Test",
            lastName: "User",
            academicRank: "Junior",
            majorOne: "CSCI",
            majorTwo: "CRIM",
            residentialStatus: "commuter",
            fallSport: { name: "tiddlywinks" },
            springSport: { name: "hang gliding" },
            slpInstructorName: "slpInstructorName"
        };

        let domains = {
            fallSport: [{ name: "tiddlywinks" }, { name: "foosball" }],
            springSport: [{ name: "extreme napping" }, { name: "hang gliding" }],
            majorOne: [{ name: "CSCI" }, { name: "CRIM" }, { name: "Basket weaving" }],
            majorTwo: [{ name: "CSCI" }, { name: "CRIM" }, { name: "Basket weaving" }],
        };

        // Generate the view
        studentViews.editFormRequested(request, response, expectedData, domains);
        
        let checkFor = new ViewTests(response._getString());
        
        // console.log("response: " + response._getString());

        it("should include a text input to edit the first name", function(done) {
            checkFor.formInputText("firstName", expectedData.firstName).should.be.true();
            done();
        });

        it("should include a text input to edit the last name", function(done) {
            checkFor.formInputText("lastName", expectedData.lastName).should.be.true();
            done();
        });

        it("should include select options to edit the fall sport", function(done) {
            checkFor.formSelectOption("fallSport", expectedData.fallSport.name).should.be.true();
            done();
        });

        it("should include select options to edit the spring sport", function(done) {
            checkFor.formSelectOption("springSport", expectedData.springSport.name).should.be.true();
            done();
        });

        it("should include a submit button to send the form", function(done) {
            checkFor.formButton("submitButton").should.be.true();
            done();
        });

    });
});
