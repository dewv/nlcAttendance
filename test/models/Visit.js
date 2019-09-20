/**
 * @module Visit
 */

// "use strict";
const should = require("should");
const helperIntegrationTests = require("./_helpers");

/**
 * Tests the specified model's interaction with Student, using the specified test data.
 * @argument {string} model - The sailsjs model to be tested.
 * @argument {Object[]} testData - Data record to be used for testing.
 * @public
 */
// module.exports = function(testData) {

describe("Visit model", function() {
    // let testData = {
    let testData = {
        associations: {},
        record: {},
        checkInForm: {},
        checkOutFormNL: {}, // No Length in form submission test data. 
        checkOutFormLE: {}, // Length Estimated in form submission data.
    };

    before(async function() {

        testData.record = Visit.testRecords[2];
        testData.associations.student = await Student.findOne({ id: testData.record.student });
        testData.checkInForm = { purpose: "test" };
        testData.checkOutFormNL = { purposeAchieved:"Yes", usedTutor:"Yes", tutorCourses:"test", comment:"test comment", student: 3 }; 
        testData.checkOutFormLE = { purposeAchieved:"Yes", length:"1.25", usedTutor:"Yes", tutorCourses:"test", comment:"test comment", student: 3 };
        
    });

    // Run helper integration tests
    helperIntegrationTests("visit", testData); //testData);

    /**
     * Tests the Visit Model, using the specified test data.
     * @argument {string} model - The sailsjs model to be tested.
     * @argument {Object[]} testData - Data record to be used for testing.
     * @public
     */
    describe("Test for Visit Model", function() {

        context("`Test the association of the student model for name attribute.", async function() {
            it("Returns correct id number", async function() {
                let expected = testData.record.student;
                let visitSample = await Visit.findOne(3);
                visitSample.should.not.be.an.Error();
                visitSample.should.be.an.Object();
                let result = visitSample.student;
                result.should.not.be.an.Error();
                should.exist(result, "The record did not return anything.");

                result.should.equal(expected, "The name attribute is set to " + result + " but expected to be set to " + expected + ".");
            });
        });
        context("`Test the afterPopulateOne function,", async function() {
            it("checkOutTime gets set to current time when checkOutTime was null", async function() {
                testData.record.checkOutTime = null;
                let test = await Visit.afterPopulateOne(testData.record);
                let eT = (new Date(sails.helpers.getCurrentTime())).getTime();
                let tT = (new Date(test.checkOutTime)).getTime();
                let expected = eT - tT;
                let result;
                if (expected <= 1000) {
                    result = expected;
                }
                else {
                    result = tT;
                }

                result.should.be.equal(expected, "After the record updated the checkOutTime attribute is " + result + ". We expected " + eT + ".");
            });
            it("`length` should be calculated correctly", async function() {
                testData.record.checkInTime = "2019-02-25T15:30:00.000Z";
                testData.record.checkOutTime = "2019-02-25T16:30:00.000Z";
                let visitTest = Visit.afterPopulateOne(testData.record);
                let result = visitTest.length;
                let cI = new Date(testData.record.checkInTime);
                let cO = new Date(testData.record.checkOutTime);
                let dif = cO.getTime() - cI.getTime();
                let expected = sails.helpers.convertToHours(dif);
                should.exist(result, "`length` does not exist.");
                result.should.be.equal(expected, "After the record updated, `length` is " + result + ". We expected " + expected + ".");
            });
            it("`isLengthEstimated` is set to true when `length` is longer that 8 hours.", async function() {
                testData.record.checkInTime = "2019-02-25T10:30:00.000Z";
                testData.record.checkOutTime = "2019-02-25T20:30:00.000Z";
                let visitTest = Visit.afterPopulateOne(testData.record);
                let result = visitTest.isLengthEstimated;
                let expected = true;
                result.should.not.be.an.Error();
                expected.should.not.be.an.Error();
                result.should.be.equal(expected, "After the record updated the isLengthEstimated attribute is " + result + ". We expected it to be " + expected + ".");
            });
        });
        context("Test the `afterEncodeAssociations` function,", async function() {
            it("`checkOutTime` gets set to current time when check out form is submitted", async function() {
                let checkOutTest = await Visit.afterEncodeAssociations(testData.checkOutFormNL);
                let eT = (new Date(sails.helpers.getCurrentTime())).getTime();
                let tT = (new Date(checkOutTest.checkOutTime)).getTime();
                let expected = eT - tT;
                let result;
                if (expected <= 1000) {
                    result = expected;
                }
                else {
                    result = tT;
                }

                result.should.be.equal(expected, "After the record updated the checkOutTime attribute is " + result + ". We expected " + eT + ".");
            });
            it("`length` should be calculated correctly when check out form is submitted", async function() {
                let checkOutTest = await Visit.afterEncodeAssociations(testData.checkOutFormNL);
                let result = checkOutTest.length;
                let expected = 24;
                should.exist(result, "`length` does not exist.");
                result.should.be.equal(expected, "After the record updated the `length` attribute is " + result + ". We expected " + expected + ".");
            });
            it("`isLengthEstimated` is set to true when the system doesn't calculate the `length` when check out form is submitted", async function() {
                let checkOutTest = await Visit.afterEncodeAssociations(testData.checkOutFormLE);
                let result = checkOutTest.isLengthEstimated;
                let expected = true;
                should.exist(result, "isLengthEstimated does not exist.");
                result.should.be.equal(expected, "After the record updated the isLengthEstimated attribute is " + result + ". We expected " + expected + ".");
            });
            it("Nothing should change when check in form is submitted", async function() {
                let checkInTest = await Visit.afterEncodeAssociations(testData.checkInForm);
                let result = checkInTest;
                let expected = testData.checkInForm;
                result.should.be.equal(expected, "After the function ran the data is " + result + ". We expected " + expected + ".");
            });
        });
    });


});

/*global Visit*/
