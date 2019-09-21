/**
 * @module _helpers
 */

const should = require("should");
const config = require("../../config/models");

/**
 * Tests the specified model's integration with helpers, using the specified test data.
 * @argument {string} model - The sailsjs model to be tested.
 * @argument {Object[]} testData - Data record to be used for testing.
 * @public
 */
module.exports = function(modelName, testData) {

    describe("Standard tests of model, helpers integration", async function() {

        context("`getDefaults` helper", async function() {
            it("should return a record with expected sailsjs model attributes", async function() {
                let model = sails.models[modelName];
                let result = sails.helpers.getDefaults(model);
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                for (let property in model.attributes) {
                    if (config.models.attributes[property]) continue; // skip base attributes
                    should.notEqual(typeof result[property], "undefined", `The record returned by \`getDefaults\` has no ${property} property`);
                }
            });
        });

        context("`getAssociationDomains` helper", async function() {
            it("should return a dictionary containing domain values for each appropriate model attribute", async function() {
                let model = sails.models[modelName];
                let result = await sails.helpers.getDomains(model);
                if (model.generateHtmlSelect) {
                    for (let property in model.generateHtmlSelect) {
                        if (model.generateHtmlSelect[property]) {
                            should.exist(result[property], `The dictionary returned by \`getDomains\` has no ${property} property`);
                        }
                    }
                }
            });
        });

        context("`encodeAssociations` helper", async function() {
            it("should replace the specified record's domain values with keys for each associated sailsjs model", async function() {
                let model = sails.models[modelName];
                let record = sails.helpers.getDefaults(model);
                for (let property in model.attributes) {
                    if (sails.helpers.isAssociation(model, property)) {
                        should.exist(sails.models[model.attributes[property].model].candidateKey, `This test code depends on each association defining a candidate key, but none found for association \`${property}\``);
                        record[property] = testData.associations[property][sails.models[model.attributes[property].model].candidateKey];
                        // record[property] = testData.associations[property][testData.associations[property].candidateKey];
                    }
                }

                await sails.helpers.encodeAssociations(model, record);

                for (let property in model.attributes) {
                    if (sails.helpers.isAssociation(model, property)) {
                        record[property].should.equal(testData.associations[property].id);
                    }
                }
            });
        });

        context("`populateOne` helper", async function() {
            it("should return a data record for the specified ID, with all associations populated", async function() {
                let model = sails.models[modelName];
                let id = testData.record.id;
                let result = await sails.helpers.populateOne(model, id);
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                should.exist(result.id, "The record returned by `populateOne` has no `id` property");
                result.id.should.be.a.Number();
                result.id.should.equal(id, `The record returned by \`populateOne\` has \`id\` ${result.id} but should have \`id\` ${id}`);
                for (let property in model.attributes) {
                    should(result[property]).not.be.undefined(); //result[property], `The record returned by \`populateOne\` has no \`${property}\` property`);
                    if (sails.helpers.isAssociation(model, property)) {
                        if (result[property] !== null) result[property].should.be.an.Object();
                        for (let associatedProperty in result[property]) {
                            result[property][associatedProperty].should.equal(testData.associations[property][associatedProperty]);
                        }
                    }
                    else {
                        if (result[property] instanceof Date) {
                            let diff = result[property] - testData.record[property];
                            let delta = 1000 * 5;
                            diff.should.be.approximately(0, delta, `Date values differ by more than ${delta} milliseconds.`);
                        }
                        else {
                            result[property].should.equal(testData.record[property]);
                        }
                    }
                }
            });
        });

        context("`getCurrentTime` helper", async function() {
            it("should return the current synchronized time", async function() {
                let result = sails.helpers.getCurrentTime();
                let expected = Date.now();
                result.should.not.be.an.Error();
                expected.should.not.be.an.Error();
                should.exist(result, "The helper did not return anything");
                result.should.equal(expected, "The helper returned " + result + " , while the test expected " + expected + ".");
            });
        });
        
        context("`convertToHours` helper", async function() {
            it("should return the number of hours, to the nearest quarter hour", async function() {
                for (let i = 6000000; i < 10000000; i = i + 1000000) {
                    let result = sails.helpers.convertToHours(i);
                    let time = i / 3600000;
                    let expected = parseFloat((Math.round(time * 4) / 4).toFixed(2));
                    result.should.not.be.an.Error();
                    expected.should.not.be.an.Error();
                    should.exist(result, "The helper did not return anything");
                    result.should.equal(expected, "The helper returned " + result + " , while the test expected " + expected + ".");
                }
            });
        });

        context("`getRecordList` helper", async function() {
            it("should return a array of records for a defined model", async function() {
                let records = {};
                let result = await sails.helpers.getRecordList(Student, records);
                let expected = await Student.find()
                result.should.not.be.an.Error();
                expected.should.not.be.an.Error();
                should.exist(result, "The helper did not return anything");
                for (let i = 0; i < result.length; i++) {
                    result[i].id.should.equal(expected[i].id, "The helper returned " + JSON.stringify(result[i]) + " , while the test expected " + JSON.stringify(expected[i]) + ".");
                }
            });
            it("should return a array of records for a defined model with a association", async function() {
                let records = {};
                let result = await sails.helpers.getRecordList(Visit, records);
                let expected = await Visit.find().populate('student');
                result.should.not.be.an.Error();
                expected.should.not.be.an.Error();
                should.exist(result, "The helper did not return anything");
                for (let i = 0; i < result.length; i++) {
                    result[i].id.should.equal(expected[i].id, "The helper returned " + JSON.stringify(result[i]) + " , while the test expected " + JSON.stringify(expected[i]) + ".");
                }
            });
        });
    });
};
