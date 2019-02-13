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
            visitLength: " ",
            visitPurpose: "testing",
            purposeAchived: "No",
            usedTutor: true,
            tutor: "math",
            comment: "testing",
            estimatedDuration: "",
        };


        // Before tests run ...
        before(async function() {

            // Destroy any old test data that might be haning around
            await destroyTestData();

            // Associate, using the new IDs
            testVisit.studentName = testData.associations.student.firstName + " " + testData.associations.student.lastName;

            // Create main test record, with associations in place
            visitData.record = await Visit.create(testVisit).fetch();
        });

        // After tests run ...
        after(destroyTestData);

        async function destroyTestData() {
            // Destroy main test record
            await Visit.destroyOne({ username: testVisit.studentName });
        }
    });
};

/*global Visit*/
