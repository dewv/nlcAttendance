/**
 * @module _visit
 */

"use strict";
const should = require("should");
const config = require("../../config/models");

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
            usedTutor: true,
            tutor: "Math",
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
            context("`Test the beforeUpdate lifecycle callback,", async function () {
                it("Attribute visitLength was calculated correctly", async function() {
                   visitData.record.checkOutTime = new Date();
                   await Visit.update(visitData.record, visitData.record);
                   let visitSample = Visit.findOne(1);
                   let result = visitSample.visitLength;
                   let checkIn = new Date.getMinutes(visitData.record.checkInTime);
                   let checkOut = new Date.getMinutes(visitData.record.checkOutTime);
                   let expected = checkOut - checkIn;
                   result.should.not.be.an.Error();
                   result.should.be.an.Number();
                   expected.should.not.be.an.Error();
                   expected.should.be.an.Number();
                   should.exist(result, "visitLength does not exist.");
                   
                   result.should.be.equal(expected, "After the record updated the visitLength attribute is " + result + ". We expected " + expected + ".");
                   
                });
            });
        });

        // After tests run ...
        after(destroyTestData);

        async function destroyTestData() {
            // Destroy main test record
            await Visit.destroyOne({ id: 1});
        }
    });
};

/*global Visit*/
