"use strict";
const jquery = require("cheerio");
const helperIntegrationTests = require("./_helpers");

helperIntegrationTests();

class ViewTests {
    /**
     * Creates a new view test object.
     * @argument {string} html - The HTML of the view under test.
     */
    constructor(html) {
        // Parse the HTML for jquery use.
        this.$ = jquery.load(html);
    }

    /** Returns true if the view contains an input with the specified ID and value; false otherwise.
     * @argument {string} id - The specified ID.
     * @argument {string} value - The specified value.
     * @returns {boolean}
     * @public
     */
    formInputText(id, value) {
        let results = this.$("input#" + id);
        return (results.length === 1 && results.val() === value);
    }
    
    /** Returns true if the view contains a text are with the specified ID and value; false otherwise.
     * @argument {string} id - The specified ID.
     * @argument {string} vale - The specified value.
     * @returnts {boolean}
     * @public
     */
    formTextArea(id, value) {
        let results = this.$("textarea#" + id);
        return (results.length === 1 && results[0].attribs.value === value);
        
    }

    /** Returns true if the view contains one checked radio button with the specified ID; false otherwise. 
     * @argument {string} id - The specified ID.
     * @returns {boolean}
     * @public
     */
    formInputRadio(id) {
        let results = this.$("input#" + id);
        return (results.length === 1 && results.prop("checked"));
    }

    /** Returns true if the view contains one select with the specified ID and specified value selected; false otherwise.
     * @argument {string} id - The specified ID.
     * @argument {string} [value] - The specified value.
     * @returns {boolean}
     * @public
     */
    formSelectOption(id, value) {
        let selector = `select#${id}`;
        if (value) selector += ` > option[value="${value}"]`;
        let results = this.$(selector);
        

        console.log(results.length);
        console.log(results.prop("selected"));
        console.log(value);
        
        return (results.length === 1 && (results.prop("selected") || typeof value === "undefined"));
    }

    /** Returns true if the view contains one button with the specified ID; false otherwise.
     * @argument {string} id - The specified ID.
     * @returns {boolean}
     * @public
     */
    formButton(id) {
        let results = this.$(`button#${id}`);
        return (results.length === 1);
    }
}


module.exports = ViewTests;
