require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Visit Views", function() {
    const pathToView = "pages/visit/editForm";

    context("The edit form", async function(done) {

        let expectedData = {
            name: { id: "1" },
            checkInTime: "2019-02-20T15:11:46.000Z",
            checkOutTime: "2019-02-20T15:11:50.000Z",
            length: null,
            purpose: "Study",
            purposeAchieved: "No",
            tutorCourses: "math",
            comment: "Very good",
            isLengthEstimated: false,
        };

        let ejsData = {
            formData: expectedData,
            purposeAchieved: `<select id="purposeAchieved"><option value="Yes">Yes</option> <option value="No" selected>No</option> <option value="Not sure">Not sure</option> </select>`,
            action: "/visit",
        };
        // Generate the view
        ejs.renderFile("views/" + pathToView + ".html", ejsData, function(error, result) {
            if (error) {
                console.log("Error Rendering File: ", JSON.stringify(error));
            }
            let checkFor = new ViewTests(result);

            it("should include select options to edit the question of goal/purpose accomplished", function(done) {
                checkFor.formSelectOption("purposeAchieved", expectedData.purposeAchieved).should.be.true();
                done();
            });
            
            it("should include a text input to edit the tutor Courses", function(done) {
                checkFor.formInputText("tutorCourses", expectedData.tutorCourses).should.be.true();
                done();
            });

            it("should include a text area for comments of the visit", function(done) {
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
