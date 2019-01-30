"use strict";

const should = require("should");

function testModel(model, testData) {
    describe("standard superclass tests", function() {

        context("`sails` property", function() {
            it("should be a valid sailsjs model", function() {
                let result = model.sails;
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                should.exist(result.findOne, "`sails` property is not a sailsjs model: `findOne` method is not defined");
            });
        });

        context("`getBlank` method", function() {
            it("should return a record with expected sailsjs model attributes", function() {
                let result = model.getBlank();
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                for (let property in model.sails.attributes) {
                    should.exist(result[property], `The record returned by \`getBlank\` has no ${property} property`);
                }
            });
        });

        context("`getAssociationDomains` method", function() {
            it("should return a dictionary containing domain values for each associated sailsjs model", async function() {
                let result = await model.getAssociationDomains();
                for (let property in model.sails.attributes) {
                    if (model.hasAssociation(property)) {
                        should.exist(result[property], `The dictionary returned by \`getAssociationDomains\` has no ${property} property`);
                    }
                }
            });
        });

        context("`encodeAssociations` method", function() {
            it("should replace the specified record's domain values with keys for each associated sailsjs model", async function() {
                let record = model.getBlank();
                for (let property in model.sails.attributes) {
                    if (model.hasAssociation(property)) {
                        should.exist(testData.associations[property].name, "This test code depends on each association having a `name` property, but found none in " + property + ": " + JSON.stringify(testData.associations[property]));

                        record[property] = testData.associations[property].name;
                    }
                }

                await model.encodeAssociations(record);

                for (let property in model.sails.attributes) {
                    if (model.hasAssociation(property)) {
                        record[property].should.equal(testData.associations[property].id);
                    }
                }
            });
        });

        context("`populateOne` method", function() {
            it("should return a data record for the specified ID, with all associations populated", async function() {
                let id = testData.records[0].id;
                let result = await model.populateOne(id);
                result.should.not.be.an.Error();
                result.should.be.an.Object();
                should.exist(result.id, "The record returned by `populateOne` has no `id` property");
                result.id.should.be.a.Number();
                result.id.should.equal(id, `The record returned by \`populateOne\` has \`id\` ${result.id} but should have \`id\` ${id}`);
                for (let property in model.sails.attributes) {
                    should.exist(result[property], `The record returned by \`populateOne\` has no \`${property}\` property`);
                    if (model.hasAssociation(property)) {
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
}

module.exports = testModel;
