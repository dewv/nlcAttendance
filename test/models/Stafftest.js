/**
 * @file Defines tests for the Student sailsjs model.
 */

"use strict";
const helperIntegrationTests = require("./_helpers");

describe("Staff model", function() {
    let testData = {
        associations: {},
        record: {}
    };

    let testStaff = {
        username: "TESTSTUDENT@DEWV.EDU",
        firstName: "TEST",
        lastName: "STAFF",        
        isSlpInstructor: "TESTSLP"
    };

    // Before tests run ...
    before(async function() {

        // Destroy any old test data that might be haning around
        await destroyTestData();

        // Create test data: associated model records
        // Associate, using the new IDs

        // Create main test record, with associations in place
        testData.record = await Staff.create(testStaff).fetch();
    });

    // After tests run ...
    after(destroyTestData);

    // Run helper integration tests
    helperIntegrationTests("student", testData);
    
    async function destroyTestData() {
        // Destroy main test record
        await Staff.destroyOne({ username: testStaff.username });
        
        // Destroy test records in associated model
    }
});
