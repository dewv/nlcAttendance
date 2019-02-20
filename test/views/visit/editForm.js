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
            action: "/student/0",
            fallSport: `<select id="fallSport"><option value="${expectedData.fallSport.name}" selected>${expectedData.fallSport.name}</option> <option value="fs2">fs2</option> </select>`,
            springSport: `<select id="springSport"><option value="ss1">ss1</option> <option value="ss2">ss2</option> </select>`,
            majorOne: `<select id="majorOne"><option value="mo1">mo1</option> <option value="${expectedData.majorOne.name}" selected>${expectedData.majorOne.name}</option> <option value="mo3">mo3</option> </select>`,
            majorTwo: `<select id="majorTwo"><option value="mt1">mt1</option> <option value="mt2">mt2</option> <option value="mt3">mt3</option> </select>`
        };

        // Generate the view
        ejs.renderFile("views/" + pathToView + ".html", ejsData, function(error, result) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            let checkFor = new ViewTests(result);

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
                checkFor.formSelectOption("springSport").should.be.true();
                done();
            });

            it("should include a submit button to send the form", function(done) {
                checkFor.formButton("submitButton").should.be.true();
                done();
            });
        });
    });
});
