/**
 * @name sails&period;helpers&period;generateHtmlSelect
 * @description Generates an HTML &lt;select&gt; tag with &lt;option&gt;s for a specified domain's values.
 * @function
 * @argument {string} htmlName - Value to be used for the &lt;select&gt;'s name and id attributes.
 * @argument {Object[]} domain - Array of objects with `name` properties that will be &lt;option&gt;s in the &lt;select&gt;.
 * @argument {string} [selected] - The &lt;option&gt; value that should be selected.
 * @return {string} HTML for a &lt;select&gt; tag.
 */
module.exports = {
    friendlyName: "Generate HTML <select>",

    description: "Generates an HTML <select> tag with <option>s for a specified domain's values.",

    inputs: {
        htmlName: {
            description: "Value to be used for the <select>'s name and id attributes.",
            type: "string",
            required: true
        },

        domain: {
            description: "Array of objects with `name` properties that will be <option>s in the <select>.",
            type: "ref",
            required: true
        },

        selected: {
            description: "The option value that should be selected.",
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
        let result = `<select id="${inputs.htmlName}" name="${inputs.htmlName}"${inputs.domain.inputRequired ? " required" : ""} size="1"> <option value="">Choose one ...</option> `;
        console.log(JSON.stringify(inputs.domain.options));
        for (let i = 0; i < inputs.domain.options.length; i++) {
            /* istanbul ignore else */
            if (inputs.domain.options[i].status === "Enabled" || !inputs.domain.options[i].status) {
                result += `<option value="${inputs.domain.options[i].name}"`;
                if (inputs.selected && inputs.selected === inputs.domain.options[i].name) result += " selected";
                result += `>${inputs.domain.options[i].name}</option> `;
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
