/**
 * @file Defines tests for the Student sailsjs model.
 */

"use strict";
const helperIntegrationTests = require("./_helpers");

describe("Student model", function() {
    let testData = {
        associations: {},
        records: []
    };

    before(async function() {
        // before tests run, create test data
        testData.associations.fallSport = await FallSport.create({ name: "TEST FALL SPORT" }).fetch();
        testData.associations.springSport = await SpringSport.create({ name: "TEST SPRING SPORT" }).fetch();

        testData.records.push(await Student.create({
            username: "TESTSTUDENT@DEWV.EDU",
            firstName: "TEST",
            lastName: "STUDENT",
            fallSport: testData.associations.fallSport.id,
            springSport: testData.associations.springSport.id
        }).fetch());
    });

    after(async function() {
        // after tests run, destroy test data
        await FallSport.destroyOne({ id: testData.associations.fallSport.id });
        await SpringSport.destroyOne({ id: testData.associations.springSport.id });

        for (let i = 0; i < testData.records.length; i++) {
            await Student.destroyOne({ id: testData.records[i].id });
        }
    });

    helperIntegrationTests("student", testData);
});
