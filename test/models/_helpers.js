/**
 * @module _helpers
 */

"use strict";
const should = require("should");
const config = require("../../config/models");

/**
 * Tests the specified model's integration with helpers, using the specified test data.
 * @argument {string} model - The sailsjs model to be tested.
 * @argument {Object[]} testData - Data record to be used for testing.
 * @public
 */
module.exports = function(modelName, testData) {

    describe("Standard tests of model, helpers integration", function() {

        context("`getDefaults` helper", async function() {
            it("should return a record with expected sailsjs model attributes", async function() {
                let model = sails.models[modelName];
                let result = sails.helpers.getDefaults(model);
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                for (let property in model.attributes) {
                    if (config.models.attributes[property]) continue; // skip base attributes
                    should.exist(result[property], `The record returned by \`getDefaults\` has no ${property} property`);
                }
            });
        });

        context("`getAssociationDomains` helper", function() {
            it("should return a dictionary containing domain values for each appropriate model attribute", async function() {
                let model = sails.models[modelName];
                let result = await sails.helpers.getDomains(model);
                for (let property in model.attributes) {
                    if (sails.helpers.isAssociation(model, property) ||
                        (model.attributes[property].validations && model.attributes[property].validations.isIn)) {
                        should.exist(result[property], `The dictionary returned by \`getDomains\` has no ${property} property`);
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
                        should.exist(testData.associations[property].name, "This test code depends on each association having a `name` property, but found none in " + property + ": " + JSON.stringify(testData.associations[property]));
                        record[property] = testData.associations[property].name;
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

        context("`populateOne` helper", function() {
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
                        result[property].should.equal(testData.record[property]);
                    }
                }
            });
        });
        
        context("`getCurrentTime helper", function() {
            it("should return the current synchronized time", async function() {
                let result = sails.helpers.getCurrentTime();
                let expected = Date.now();
                result.should.not.be.an.Error();
                expected.should.not.be.an.Error();
                should.exist(result, "The helper did not return anything");
                result.should.equal(expected, "The helper returned " + result + " , while the test expected " + expected + ".");
            });
        });
    });
};
