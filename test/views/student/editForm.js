require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Student views", function() {
    const pathToView = "pages/student/editForm";

    context("The edit form", async function() {

        let expectedData = {
            id: 0,
            username: "testuser@dewv.net",
            firstName: "Test",
            lastName: "User",
            academicRank: "Junior",
            majorOne: "CSCI",
            majorTwo: null,
            residentialStatus: "Commuter",
            fallSport: { name: "fs1" },
            springSport: null,
            slpInstructorName: "slpInstructorName"
        };

        let ejsData = {
            formData: expectedData,
            action: "/student/0",
            fallSport: `<select id="fallSport"><option value="${expectedData.fallSport.name}" selected>${expectedData.fallSport.name}</option> <option value="fs2">fs2</option> </select>`,
            springSport: `<select id="springSport"><option value="ss1">ss1</option> <option value="ss2">ss2</option> </select>`,
            majorOne: `<select id="majorOne"><option value="mo1">mo1</option> <option value="${expectedData.majorOne.name}" selected>${expectedData.majorOne.name}</option> <option value="mo3">mo3</option> </select>`,
            majorTwo: `<select id="majorTwo"><option value="mt1">mt1</option> <option value="mt2">mt2</option> <option value="mt3">mt3</option> </select>`,
            residentialStatus: `<select id="residentialStatus"><option value="Commuter">Commuter</option> <option value="On campus">On campus</option> </select>`,
            academicRank: `<select id="academicRank"><option value="Freshman">Freshman</option> <option value="Sophomore">Sophomore</option> <option value="Junior">Junior</option> <option value="Senior">Senior</option> </select>`
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
            
            it("should include select options to edit the academic rank", function(done) {
                checkFor.formSelectOption("academicRank").should.be.true();
                done();
            });
            
            it("should include select options to edit the residential status", function(done) {
                checkFor.formSelectOption("residentialStatus").should.be.true();
                done();
            });
            
            it("should include select options to edit the Major One", function(done) {
                checkFor.formSelectOption("majorOne").should.be.true();
                done();
            });
            
            it("should include select options to edit the major Two", function(done) {
                checkFor.formSelectOption("majorTwo").should.be.true();
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
