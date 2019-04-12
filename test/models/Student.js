/**
 * @file Defines tests for the Student sailsjs model.
 */

require("should");
const helperIntegrationTests = require("./_helpers");
// const visitModelTest = require("./Visit");

describe("Student model", function() {
    let testData = {
        associations: {},
        record: {}
    };

    // Before tests run ...
    before(async function() {

        // Create main test record, with associations in place
        testData.record = Student.testRecords[1]; //await Student.create(testStudent).fetch();
        testData.associations.fallSport = await FallSport.findOne({ id: testData.record.fallSport });
        testData.associations.springSport = await SpringSport.findOne({ id: testData.record.springSport });
        testData.associations.majorOne = await Major.findOne({ id: testData.record.majorOne });
        testData.associations.majorTwo = await Major.findOne({ id: testData.record.majorTwo });

    });

    // Run helper integration tests
    helperIntegrationTests("student", testData);

    context("A data record returned by `create()`", function() {

        it("should have correct default field values", function() {
            testData.record.forceUpdate.should.be.true();
        });
    });

});
