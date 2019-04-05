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
        record: {}
    };

    before(async function() {

        testData.record = Visit.testRecords[0];
        testData.associations.name = await Student.findOne({ id: testData.record.name });
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
                let expected = testData.record.name;
                let visitSample = await Visit.findOne(1);
                visitSample.should.not.be.an.Error();
                visitSample.should.be.an.Object();
                let result = visitSample.name;
                result.should.not.be.an.Error();
                should.exist(result, "The record did not return anything.");

                result.should.equal(expected, "The name attribute is set to " + result + " but expected to be set to " + expected + ".");
            });
        });
        context("`Test the afterPopulateOne function,", async function() {
            it("checkOutTime gets set to current time", async function() {
                testData.record.checkOutTime = null;
                testData.associations.name = await Student.findOne({ id: testData.record.name });
                let visitTest = Visit.afterPopulateOne(testData.record);
                let eT = (new Date(sails.helpers.getCurrentTime())).getTime();
                let tT = (new Date(visitTest.checkOutTime)).getTime();
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
            it("Attribute visitLength should be calculated correctly", async function() {
                testData.record.checkInTime = "2019-02-25T15:30:00.000Z";
                testData.record.checkOutTime = "2019-02-25T16:30:00.000Z";
                let visitTest = Visit.afterPopulateOne(testData.record);
                let result = visitTest.visitLength;
                let cI = new Date(testData.record.checkInTime);
                let cO = new Date(testData.record.checkOutTime);
                let dif = cO.getTime() - cI.getTime();
                let expected = sails.helpers.convertToHours(dif);
                should.exist(result, "visitLength does not exist.");
                result.should.be.equal(expected, "After the record updated the visitLength attribute is " + result + ". We expected " + expected + ".");
            });
            it("Attribute isLengthEstimated is set to true when visitLength is longer that 5 hours.", async function() {
                testData.record.checkInTime = "2019-02-25T15:30:00.000Z";
                testData.record.checkOutTime = "2019-02-25T21:30:00.000Z";
                let visitTest = Visit.afterPopulateOne(testData.record);
                let result = visitTest.isLengthEstimated;
                let expected = true;
                result.should.not.be.an.Error();
                expected.should.not.be.an.Error();
                result.should.be.equal(expected, "After the record updated the isLengthEstimated attribute is " + result + ". We expected it to be " + expected + ".");
            });
        });
    });

    
});

/*global Visit*/
