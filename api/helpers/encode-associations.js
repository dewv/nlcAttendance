/**
 * @name sails&period;helpers&period;encodeAssociations
 * @description Replaces user-entered association domain values with their corresponding ID/key.
 * @function
 * @argument {Model} model - A Sails model defining the associations, if any.
 * @argument {Record} record - A data record that may contain association domain values that need encoding.
 * @return {Record} The record argument, modified so that any association domain values are replace with their ID/key.
 * @async
 */
module.exports = {
    friendlyName: "Encode associations",

    description: "Replaces user-entered association domain values with their corresponding ID/key.",

    inputs: {
        model: {
            description: "A Sails model defining the associations, if any.",
            type: "ref",
            required: true
        },

        record: {
            description: "A data record that may contain association domain values that need encoding.",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Encoded associations",
        }
    },

    fn: async function(inputs, exits) {
        for (let property in inputs.model.attributes) {
            if (sails.helpers.isAssociation(inputs.model, property)) {
                let lookup = await sails.models[inputs.model.attributes[property].model].findOne({ name: inputs.record[property] });
                inputs.record[property] = lookup ? lookup.id : /* istanbul ignore next */ null;
            }
        }

        // Send back the result through the success exit.
        return exits.success(inputs.record);
    }
};
