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
        testData.associations.fallSport = await Sport.create({ name: "TEST FALL SPORT", season: "Fall" }).fetch();

        testData.associations.springSport = await Sport.create({ name: "TEST SPRING SPORT", season: "Spring" }).fetch();

        let newRecord = await Student.create({
            username: "TESTSTUDENT@DEWV.EDU",
            firstName: "TEST",
            lastName: "STUDENT",
            fallSport: testData.associations.fallSport.id,
            springSport: testData.associations.springSport.id
        }).fetch();
        
        testData.records.push(await studentModel.populateOne(newRecord.id));
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
    
    // Testing Call
    runSuperclassTests(studentModel, testData);
    studentTest(studentModel, testData);
    
    // studentModel Test
    function studentTest(model, testData) {
        describe("studentModel specific test", function() {
        
            context("Fall Sport is a Fall Sport", function() {
                it("The sport in the student's fallSport field is a fall sport", async function() {
                    for (let i = 0; i < testData.records.length; i++) {
                        let a = await studentModel.populateOne(testData.records[i].id);
                        let result = a.fallSport.season;
                        let expected = 'Fall';
                        should.exist(result, "The fallSport field does not have a season.");
                        result.should.equal(expected, "Expected the season to be " + expected + " the table returned " + result);
                    }
                });
            });
            
            context("Spring Sport is a Spring Sport", function() {
                it("The sport in the student's springSport field is a spring sport", async function() {
                    for (let i = 0; i < testData.records.length; i++) {
                        let a = await studentModel.populateOne(testData.records[i].id);
                        let result = a.springSport.season;
                        let expected = 'Spring';
                        should.exist(result, "The springSport field does not have a season.");
                        result.should.equal(expected, "Expected the season to be " + expected + " the table returned " + result);
                    }
                });
            });
        });
    }
});

/* global Student, Sport, should */
