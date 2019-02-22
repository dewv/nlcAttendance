require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Check In Views", function() {
    const pathToView = "pages/views/editForm";

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

            it("should include a text are for goal/purpose for the visit", function(done) {
                checkFor.formTextArea("visitPurpose", expectedData.visitPurpose).should.be.true();
                done();
            });
            
            it("should include a radio button for the question of goal/purpose accomplished", function(done) {
                checkFor.formInputRadio("purposeAchieved").should.be.true();
            }); 
            
            it("should include a radio button for the question Did you use a tutor?", function(done) {
                checkFor.formInputRadio("usedTutuor").should.be.true();
            });
            
            it("should include a text input to edit the tutor name", function(done) {
                checkFor.formInputText("tutor", expectedData.tutor).should.be.true();
                done();
            });
            
            it("should include a text are for comments of the visit", function(done) {
                checkFor.formTextArea("comment", expectedData.comment).should.be.true();
                done();
            });
            
            it("should include a submit button to send the form", function(done) {
                checkFor.formButton("submitButton").should.be.true();
                done();
            });
        });
    });
});
