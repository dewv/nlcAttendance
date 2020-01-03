require("should");
const ejs = require("ejs");
const ViewTests = require("../Views");

describe("Student views", function () {
    const pathToView = "pages/student/updateForm";

    context("The update form", async function () {

        let expectedData = {
            id: 0,
            username: "testuser@dewv.net",
            name: "Test User",
            academicRank: "Junior",
            majorOne: "CSCI",
            majorTwo: null,
            residentialStatus: "Commuter",
            sportOne: { name: "Sport A" },
            sportTwo: null,
            slpInstructor: { name: "SLP Instructor" }
        };

        let ejsData = {
            baseUrl: "",
            formData: expectedData,
            action: "/student/0",
            sportOne: `<select id="sportOne"><option value="${expectedData.sportOne.name}" selected>${expectedData.sportOne.name}</option> <option value="Sport B">Sport B</option> </select>`,
            sportTwo: `<select id="sportTwo"><option value="${expectedData.sportOne.name}">${expectedData.sportOne.name}</option> <option value="Sport B">Sport B</option> </select>`,
            majorOne: `<select id="majorOne"><option value="mo1">mo1</option> <option value="${expectedData.majorOne.name}" selected>${expectedData.majorOne.name}</option> <option value="mo3">mo3</option> </select>`,
            majorTwo: `<select id="majorTwo"><option value="mt1">mt1</option> <option value="mt2">mt2</option> <option value="mt3">mt3</option> </select>`,
            residentialStatus: `<select id="residentialStatus"><option value="Commuter">Commuter</option> <option value="On campus">On campus</option> </select>`,
            academicRank: `<select id="academicRank"><option value="Freshman">Freshman</option> <option value="Sophomore">Sophomore</option> <option value="Junior">Junior</option> <option value="Senior">Senior</option> </select>`,
            slpInstructor: `<select id="slpInstructor"><option value="${expectedData.slpInstructor.name}" selected>${expectedData.slpInstructor.name}</option> <option value="slp2">slp2</option> </select>`,
        };

        // Generate the view
        ejs.renderFile("views/" + pathToView + ".html", ejsData, function (error, result) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            let checkFor = new ViewTests(result);

            it("should include select options to edit the academic rank", function (done) {
                checkFor.formSelectOption("academicRank").should.be.true();
                done();
            });

            it("should include select options to edit the residential status", function (done) {
                checkFor.formSelectOption("residentialStatus").should.be.true();
                done();
            });

            it("should include select options to edit the first major", function (done) {
                checkFor.formSelectOption("majorOne").should.be.true();
                done();
            });

            it("should include select options to edit the second major", function (done) {
                checkFor.formSelectOption("majorTwo").should.be.true();
                done();
            });

            it("should include select options to edit the first sport", function (done) {
                checkFor.formSelectOption("sportOne", expectedData.sportOne.name).should.be.true();
                done();
            });

            it("should include select options to edit the second sport", function (done) {
                checkFor.formSelectOption("sportTwo").should.be.true();
                done();
            });

            it("should include select options to edit the SLP instructor", function (done) {
                checkFor.formSelectOption("slpInstructor").should.be.true();
                done();
            });

            it("should include a submit button to send the form", function (done) {
                checkFor.formButton("submitButton").should.be.true();
                done();
            });
        });
    });
});
