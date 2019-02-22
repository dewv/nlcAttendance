require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Check In Views", function() {
    const pathToView = "pages/check_in/editForm";

    context("The edit form", async function(done) {

        let expectedData = {
            name: {id: "1"},
            checkInTime: "2019-02-20T15:11:46.000Z",
            checkOutTime: "2019-02-20T15:11:50.000Z",
            visitLength: null,
            visitPurpose: "Study",
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

            it("should include a text are for the goal/purpose for the visit", function(done) {
                checkFor.formTextArea("visitPurpose", expectedData.visitPurpose).should.be.true();
                done();
            });
            
            it("should include a submit button to send the form", function(done) {
                checkFor.formButton("submitButton").should.be.true();
                done();
            });
        });
    });
});
