"use strict";

const should = require("should");

module.exports = function(model, testData) {
    describe("standard superclass tests", function() {

        context("`getBlankRecord` helper", function() {
            it("should return a record with expected sailsjs model attributes", function() {
                let result = sails.helpers.getBlankRecord(model);
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                for (let property in model.sails.attributes) {
                    should.exist(result[property], `The record returned by \`getBlankRecord\` has no ${property} property`);
                }
            });
        });

        context("`getAssociationDomains` helper", function() {
            it("should return a dictionary containing domain values for each associated sailsjs model", async function() {
                let result = await sails.helpers.getAssociationDomains(model);
                for (let property in model.attributes) {
                    if (sails.helpers.isAssociation(model, property)) {
                        should.exist(result[property], `The dictionary returned by \`getAssociationDomains\` has no ${property} property`);
                    }
                }
            });
        });

        context("`encodeAssociations` helper", async function() {
            it("should replace the specified record's domain values with keys for each associated sailsjs model", async function() {
                let record = sails.helpers.getBlankRecord(model);
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
                let id = testData.records[0].id;
                let result = await sails.helpers.populateOne(model, id);
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                should.exist(result.id, "The record returned by `populateOne` has no `id` property");
                result.id.should.be.a.Number();
                result.id.should.equal(id, `The record returned by \`populateOne\` has \`id\` ${result.id} but should have \`id\` ${id}`);
                for (let property in model.attributes) {
                    should.exist(result[property], `The record returned by \`populateOne\` has no \`${property}\` property`);
                    if (sails.helpers.isAssociation(model, property)) {
                        result[property].should.be.an.Object();
                        for (let associatedProperty in result[property]) {
                            result[property][associatedProperty].should.equal(testData.associations[property][associatedProperty]);
                        }
                    }
                    else {
                        result[property].should.equal(testData.records[0][property]);
                    }
                }
            });
        });
    });
};
