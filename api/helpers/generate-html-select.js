/**
 * @module generate-html-select 
 * 
 * Usage: `sails.helpers.generateHtmlSelect(htmlName, domain, selected);`
 */
 
module.exports = {

    friendlyName: "Generate HTML <select>",

    description: "Generate an HTML <select> tag with <option>s for a specified domain's values",

    inputs: {
        htmlName: {
            description: "Value to be used for the <select>'s name and id attributes",
            type: "string",
            required: true
        },

        domain: {
            description: "Array of objects with `name` properties that will be <option>s in the <select>",
            type: "ref",
            required: true
        },

        selected: {
            description: "The option value that should be selected",
            type: "string",
            required: false
        },
    },

    exits: {
        success: {
            outputFriendlyName: "HTML <select>",
        }
    },

    sync: true,

    fn: function(inputs, exits) {
        let result = `<select id="${inputs.htmlName}" name="${inputs.htmlName}"> <option>Choose one ...</option> `;
        for (let i = 0; i < inputs.domain.length; i++) {
            if (inputs.domain[i].name) {
                result += `<option value="${inputs.domain[i].name}"`;
                if (inputs.selected && inputs.selected === inputs.domain[i].name) result += " selected";
                result += `>${inputs.domain[i].name}</option> `;
            }
            else {
                sails.log.error("Domain value passed to generateHtmlSelect helper does not have `name` property");
            }
        }

        result += "</select>";

        // Send back the result through the success exit.
        return exits.success(result);
    }
};
