/**
 * @module _visit
 */

"use strict";
const should = require("should");

/**
 * Tests the specified model's interaction with Student, using the specified test data.
 * @argument {string} model - The sailsjs model to be tested.
 * @argument {Object[]} testData - Data record to be used for testing.
 * @public
 */
module.exports = function(model, testData) {

    describe("Visit model", function() {
        let visitData = {
            associations: {},
            record: {}
        };

        let testVisit = {
            visitPurpose: "testPurpose",
            purposeAchieved: "Yes",
            tutorCourses: "Math",
            comment: "Test Comment",
        };

        // Before tests run ...
        before(async function() {

            // Destroy any old test data that might be haning around
            await destroyTestData();

            // Associate, using the new IDs
            visitData.associations.name = testData.record.id;

            testVisit.name = visitData.associations.name;
            // Create main test record, with associations in place
            visitData.record = await Visit.create(testVisit).fetch();
        });

        /**
         * Tests the Visit Model, using the specified test data.
         * @argument {string} model - The sailsjs model to be tested.
         * @argument {Object[]} testData - Data record to be used for testing.
         * @public
         */
        describe("Test for Visit Model", function() {

            context("`Test the association of the student model for name attribute.", async function() {
                it("Returns correct id number", async function() {
                    let expected = visitData.record.name;
                    let visitSample = await Visit.findOne(1);
                    visitSample.should.not.be.an.Error();
                    visitSample.should.be.an.Object();
                    let result = visitSample.name;
                    result.should.not.be.an.Error();
                    result.should.be.an.Number();
                    should.exist(result, "The record did not return anything.");

                    result.should.equal(expected, "The name attribute is set to " + result + " but expected to be set to " + expected + ".");
                });
            });
            context("`Test the postPopulate function,", async function() {
                it("Attribute visitLength was calculated correctly", async function() {
                    visitData.record.checkInTime = "2019-02-25T15:30:00.000Z";
                    visitData.record.checkOutTime = "2019-02-25T16:30:00.000Z";
                    let visitTest = Visit.afterPopulateOne(visitData.record);
                    let result = visitTest.visitLength;
                    let cI = new Date(visitData.record.checkInTime);
                    let cO = new Date(visitData.record.checkOutTime);
                    console.log(cI);
                    console.log(cO);
                    let dif = cO.getTime() - cI.getTime();
                    let expected = sails.helpers.convertToHours(dif);
                    console.log(expected);
                    should.exist(result, "visitLength does not exist.");
                    result.should.be.equal(expected, "After the record updated the visitLength attribute is " + result + ". We expected " + expected + ".");
                });
                it("Attribute isLengthEstimated is set to true when visitLength is longer that 5 hours.", async function() {
                    visitData.record.checkInTime = "2019-02-25T15:30:00.000Z";
                    visitData.record.checkOutTime = "2019-02-25T21:30:00.000Z";
                    let visitTest = Visit.afterPopulateOne(visitData.record);
                    let result = visitTest.isLengthEstimated;
                    let expected = true;
                    result.should.not.be.an.Error();
                    expected.should.not.be.an.Error();
                    result.should.be.equal(expected, "After the record updated the isLengthEstimated attribute is " + result + ". We expected it to be " + expected + ".");
                });
            });
        });

        // After tests run ...
        after(destroyTestData);

        async function destroyTestData() {
            // Destroy main test record
            await Visit.destroyOne({ id: 1 });
        }
    });
};

/*global Visit*/
