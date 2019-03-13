require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Check-Out Views", function() {
    const pathToView = "pages/visit/editForm";

    context("The edit form", async function(done) {

        let expectedData = {
            name: { id: "1" },
            checkInTime: "2019-02-20T15:11:46.000Z",
            checkOutTime: "2019-02-20T15:11:50.000Z",
            visitLength: null,
            visitPurpose: "Study",
            purposeAchieved: "NotSure",
            tutorCourses: "math",
            comment: "Very good",
            isLengthEstimated: false,
        };

        let ejsData = {
            formData: expectedData,
            action: "/visit",
        }
        // Generate the view
        ejs.renderFile("views/" + pathToView + ".html", ejsData, function(error, result) {
            if (error) {
                console.log("Error Rendering File: ", JSON.stringify(error));
            }
            console.log(result);
            let checkFor = new ViewTests(result);

            it.skip("should include a radio button for the question of goal/purpose accomplished", function(done) {
                checkFor.formInputRadio("purposeAchieved").should.be.true();
            });

            it.skip("should include a radio button for the question Did you use a tutor?", function(done) {
                checkFor.formInputRadio("usedTutuor").should.be.true();
            });



            it("should include a text are for comments of the visit", function(done) {
                checkFor.formTextArea("comment", expectedData.comment).should.be.true();
                done();
            });

            it("should include a text input to edit the tutor Courses", function(done) {
                checkFor.formInputText("tutorCourses", expectedData.tutorCourses).should.be.true();
                done();
            });

            it("should include a submit button to send the form", function(done) {
                checkFor.formButton("submitButton").should.be.true();
                done();
            });
        });
    });
});
