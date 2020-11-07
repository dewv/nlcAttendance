/**
 * @file Defines tests for the Student sailsjs model.
 */

require("should");
// const helperIntegrationTests = require("./_helpers");

describe("Student model", function () {
    let testData = {
        associations: {},
        record: {}
    };

    // Before tests run ...
    before(async function () {
        // Create main test record, with associations in place
        testData.record = Student.testRecords[1];
        testData.associations.majorOne = await Major.findOne({ id: testData.record.majorOne });
        testData.associations.majorTwo = await Major.findOne({ id: testData.record.majorTwo });
        testData.associations.sportOne = await Sport.findOne({ id: testData.record.sportOne });
        testData.associations.sportTwo = await Sport.findOne({ id: testData.record.sportTwo });
        testData.associations.slpInstructor = await Staff.findOne({ id: testData.record.slpInstructor });
    });

    // Run helper integration tests
    // helperIntegrationTests("student", testData);

    context("A data record returned by `create()`", function () {
        it("should have correct default field values", function () {
            testData.record.forceUpdate.should.be.true();
        });
    });
});
