/**
 * @file Defines tests for the Staff sailsjs model.
 */

"use strict";
const helperIntegrationTests = require("./_helpers");

describe("Staff model", function() {
    let testData = {
        associations: {},
        record: {}
    };

    // Before tests run ...
    before(async function() {
        // Create main test record
        testData.record = Staff.testRecords[0];
    });

    // Run helper integration tests
    helperIntegrationTests("staff", testData);
    
    context("A data record returned by `create()`", function() {

        it("should have correct default field values", function() {
            testData.record.forceUpdate.should.be.true();
        });
    });
});
