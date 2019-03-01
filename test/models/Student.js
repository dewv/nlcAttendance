/**
 * @file Defines tests for the Student sailsjs model.
 */

"use strict";
const should = require("should");
const helperIntegrationTests = require("./_helpers");
const visitModelTest = require("./Visit");

describe("Student model", function() {
    let testData = {
        associations: {},
        record: {}
    };

    let testStudent = {
        username: "TESTSTUDENT@DEWV.EDU",
        firstName: "TEST",
        lastName: "STUDENT",
        academicRank: "Freshman",
        residentialStatus: "On campus"
    };

    let testFallSport = { name: "TEST FALL SPORT" };
    let testSpringSport = { name: "TEST SPRING SPORT" };
    let testMajorOne = { name: "TEST MAJOR ONE" };
    let testMajorTwo = { name: "TEST MAJOR TWO" };

    // Before tests run ...
    before(async function() {

        // Destroy any old test data that might be haning around
        await destroyTestData();

        // Create test data: associated model records
        testData.associations.fallSport = await FallSport.create(testFallSport).fetch();
        testData.associations.springSport = await SpringSport.create(testSpringSport).fetch();
        testData.associations.majorOne = await Major.create(testMajorOne).fetch();
        testData.associations.majorTwo = await Major.create(testMajorTwo).fetch();

        // Associate, using the new IDs
        testStudent.fallSport = testData.associations.fallSport.id;
        testStudent.springSport = testData.associations.springSport.id;
        testStudent.majorOne = testData.associations.majorOne.id;
        testStudent.majorTwo = null;

        // Create main test record, with associations in place
        testData.record = await Student.create(testStudent).fetch();
    });

    // After tests run ...
    after(destroyTestData);

    // Run helper integration tests
    helperIntegrationTests("student", testData);
    
    //Run Visit model test
    visitModelTest(testData);

    context("A data record returned by `create()`", function() {
        it("should have a field for each model attribute", function() {
            for (let property in testStudent) {
                testData.record.should.have.property(property);
            }

            for (let property in testData.associations) {
                testData.record.should.have.property(property);
            }
        });

        it("should have correct default field values", function() {
            testData.record.forceUpdate.should.be.true();
        });
    });

    async function destroyTestData() {
        // Destroy main test record
        await Student.destroyOne({ username: testStudent.username });

        // Destroy test records in associated model
        await FallSport.destroyOne({ name: testFallSport.name });
        await SpringSport.destroyOne({ name: testSpringSport.name });
        await Major.destroyOne({ name: testMajorOne.name });
        await Major.destroyOne({ name: testMajorTwo.name });
    }
});
