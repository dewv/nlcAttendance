/**
 * @file Defines tests for the Student sailsjs model.
 */

"use strict";
const helperIntegrationTests = require("./_helpers");

describe("Student model", function() {
    let testData = {
        associations: {},
        record: {}
    };

    let testStudent = {
        username: "TESTSTUDENT@DEWV.EDU",
        firstName: "TEST",
        lastName: "STUDENT",
    };
    let testFallSport = { name: "TEST FALL SPORT" };
    let testSpringSport = { name: "TEST SPRING SPORT" };

    // Before tests run ...
    before(async function() {

        // Destroy any old test data that might be haning around
        await destroyTestData();

        // Create test data: associated model records
        testData.associations.fallSport = await FallSport.create(testFallSport).fetch();
        testData.associations.springSport = await SpringSport.create(testSpringSport).fetch();

        // Associate, using the new IDs
        testStudent.fallSport = testData.associations.fallSport.id;
        testStudent.springSport = testData.associations.springSport.id;

        // Create main test record, with associations in place
        testData.record = await Student.create(testStudent).fetch();
    });

    // After tests run ...
    after(destroyTestData);

    // Run helper integration tests
    helperIntegrationTests("student", testData);

    async function destroyTestData() {
        // Destroy main test record
        await Student.destroyOne({ username: testStudent.username });
        
        // Destroy test records in associated model
        await FallSport.destroyOne({ name: testFallSport.name });
        await SpringSport.destroyOne({ name: testSpringSport.name });
    }
});
