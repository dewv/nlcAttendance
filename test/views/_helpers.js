/**
 * @module _helpers
 */

"use strict";
const should = require("should");
const MockExpressResponse = require("mock-express-response");

/**
 * Tests view-related helpers. 
 * @public
 */
module.exports = function() {

    describe("Standard tests of views, helper integration", function() {
        context("`generateHtmlSelect` helper", async function() {
            it("should provide a <select> tag with <option>s", function() {
                let htmlName = "HTML-TEST-NAME";
                let selectedOption = "SELECTED OPTION";
                let expected = `<select id="${htmlName}" name="${htmlName}"> <option>Choose one ...</option>`;
                let options = [];
                for (let i = 0; i < 3; i++) {
                    options.push({ name: `OPTION ${i}`});
                    expected += ` <option value="${options[i].name}">${options[i].name}</option>`;
                }
                options.push({name: selectedOption});
                expected += ` <option value="${selectedOption}" selected>${selectedOption}</option> </select>`;
                let actual = sails.helpers.generateHtmlSelect(htmlName, options, selectedOption);
                actual.should.equal(expected);
            });
        });
        
        context("`responseViewSafely` helper", async function() {
            let response = new MockExpressResponse();
            let success = false;
            response.notFound = function() {
                success = true;
            };

            it("should call `response.notFound()` when a non-existent file is requested", async function() {
                await sails.helpers.responseViewSafely(response, "PATH_OF_A_NONEXISTENT_FILE");
                (success).should.be.true();
            });
        });
    });
}
