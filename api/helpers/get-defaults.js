/**
 * @name sails&period;helpers&period;getDefaults
 * @description Generates a data record with default values for model attributes, appropriate for populating create form.
 * @function
 * @argument {Model} model - A Sails model whose attributes define the structure of the blank record.
 * @return {Record} A data record containing default values.
*/
module.exports = {

    friendlyName: "Get defaults",

    description: "Generates a data record with default values for model attributes, appropriate for populating create form.",

    inputs: {
        model: {
            description: "A Sails model whose attributes define the structure of the blank record.",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Blank record",
        }
    },

    sync: true,

    fn: function(inputs, exits) {
        let result = {};
        for (let property in inputs.model.attributes) {
            /* istanbul ignore else */
            if (inputs.model.attributes[property].defaultsTo) result[property] = inputs.model.attributes[property].defaultsTo;
            else if (inputs.model.attributes[property].model) result[property] = { name: "Choose one ..." };
            else if (inputs.model.attributes[property].type === "string") result[property] = "";
            else if (inputs.model.attributes[property].type === "boolean") result[property] = false;
            else if (inputs.model.attributes[property].type === "number") result[property] = 0;
            else if (inputs.model.attributes[property].type === "ref") result[property] = null;
            else sails.log.warn("found " + inputs.model.attributes[property].type + ": " + JSON.stringify(inputs.model.attributes[property]));
        }

        // Send back the result through the success exit.
        return exits.success(result);
    }
};
