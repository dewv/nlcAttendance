"use strict";

const runSuperclassTests = require("../furlsails/test/Model");
const studentModel = require("../studentModel");

describe("Student model", function() {
    let testData = {
        associations: {},
        records: []
    };

    before(async function() {
        // before tests run, create test data
        testData.associations.fallSport = await Sport.create({ name: "TEST FALL SPORT" }).fetch();

        testData.associations.springSport = await Sport.create({ name: "TEST SPRING SPORT" }).fetch();

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
        for (let property in testData.associations) {
            await Sport.destroyOne({ id: testData.associations[property].id });
        }

        for (let i = 0; i < testData.records.length; i++) {
            await Student.destroyOne({ id: testData.records[i].id });
        }
    });

    runSuperclassTests(studentModel, testData);
});
