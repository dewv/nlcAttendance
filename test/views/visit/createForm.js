require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Visit Views", function() {
    const pathToView = "pages/visit/createForm";

    context("The create form", async function(done) {

        let expectedData = {
            name: {id: "1"},
            checkInTime: "2019-02-20T15:11:46.000Z",
            checkOutTime: "2019-02-20T15:11:50.000Z",
            length: null,
            purpose: "Study",
            purposeAchieved: "NotSure",
            usedTutor: true,
            tutor: "DR. Help",
            comment: "Very good",
            needEstimate: false,
            estimatedDuration: null,
        };

        let ejsData = {
            formData: expectedData,
            action: "/visit",
        };

        // Generate the view
        ejs.renderFile("views/" + pathToView + ".html", ejsData, function(error, result) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            let checkFor = new ViewTests(result);

            it("should include a text area for the goal/purpose for the visit", function(done) {
                checkFor.formTextArea("purpose", expectedData.purpose).should.be.true();
                done();
            });
            
            it("should include a submit button to send the form", function(done) {
                checkFor.formButton("submitButton").should.be.true();
                done();
            });
        });
    });
});
