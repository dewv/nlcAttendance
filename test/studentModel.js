"use strict";

const runSuperclassTests = require("../furl/furlsails/test/Model");
const studentModel = require("../furl/studentModel");
const should = require("should");

describe("Student model", function() {
    let testData = {
        associations: {},
        records: []
    };

    before(async function() {
        // before tests run, create test data
        testData.associations.fallSport = await Sport.create({ name: "TEST FALL SPORT", season: "Fall" }).fetch();

        testData.associations.springSport = await Sport.create({ name: "TEST SPRING SPORT", season: "Spring" }).fetch();

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
    
    // Testing Call
    runSuperclassTests(studentModel, testData);
    studentTest(studentModel, testData);
    
    // studentModel Test
    function studentTest(model, testData) {
        describe("studentModel specific test", function() {
        
            context("`fallSport should only contain sports with the season attribute  equivlant to 'Fall'", function() { //Sports applied by their season attribute.
                it("should find 'Fall' season attribute for the record", async function() {
                    let fall = await Sport.findOne({ season: 'Fall' });
                    let result = fall.season;
                    let association = testData.associations.fallSport.season;
                    should.exist(result, "fallSport domain is empty");
                    result.should.equal(association, "fallSport domain contains " + result + " but should contain " + association);
                });
            });
            
            context("`springSport should only contain sports with the season attribute  equivlant to 'Fall'", function() {
                it("should find 'Fall' season attribute for the record", async function() {
                    let spring = await Sport.findOne({ season: 'Spring' });
                    let result = spring.season;
                    let association = testData.associations.springSport.season;
    
                    should.exist(result, "fallSport domain is empty");
                    result.should.equal(association, "fallSport domain contains " + result + " but should contain " + association);
    
                });
            });
        });
    }
});

/* global Student, Sport */
