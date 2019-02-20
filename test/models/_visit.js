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
            visitData.associations.name = await sails.helpers.populateOne(model, testData.record.id);
            
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

            context("Test the association of the student model for name attribute.", async function() {
                it("Returns correct Name", async function() {
                    let expected = visitData.record.name.firstName + " " + visitData.record.name.lastName;
                    let visitSample = await sails.helpers.populateOne("visit", 1);
                    // visitSample.should.not.be.an.Error();
                    // visitSample.should.be.an.Object();
                    let result = visitSample.name.firstName + " " + visitSample.name.lastName;
                    // result.should.not.be.an.Error();
                    // result.should.be.an.String();
                    should.exits(result, "The record did not return anything.");
                    
                    result.should.equal(expected, "The populateOne call returned " + result + " but expected " + expected + ".");
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
