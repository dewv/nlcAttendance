"use strict";
const sails = require("sails");
const modelTests = require("./Model");

describe("Student model", function() {
    let testData = {
        associations: {},
        records: []
    };

    before(async function() {
        // before tests run, create test data
        testData.associations.fallSport = await sails.models.Sport.create({ name: "TEST FALL SPORT" }).fetch();

        testData.associations.springSport = await sails.models.Sport.create({ name: "TEST SPRING SPORT" }).fetch();

        testData.records.push(await sails.models.Student.create({
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
            await sails.models.Sport.destroyOne({ id: testData.associations[property].id });
        }

        for (let i = 0; i < testData.records.length; i++) {
            await sails.models.Student.destroyOne({ id: testData.records[i].id });
        }
    });

    modelTests(sails.models.Student, testData);
});
