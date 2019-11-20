/**
 * @name sails&period;helpers&period;encodeAssociations
 * @description Replaces user-entered association domain values with their corresponding ID/key.
 * @function
 * @argument {Model} model - A Sails model defining the associations, if any.
 * @argument {Record} record - A data record that may contain association domain values that need encoding.
 * @return {Record} The record argument, modified so that any association domain values are replaced with their ID/key.
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

    fn: async function (inputs, exits) {
        for (let property in inputs.model.attributes) {
            if (sails.helpers.isAssociation(inputs.model, property) && typeof inputs.record[property] !== "undefined") {
                let lookup = undefined;
                let candidateKey = sails.models[inputs.model.attributes[property].model].candidateKey;
                /* istanbul ignore else */
                if (candidateKey) {
                    let criteria = {};
                    criteria[candidateKey] = inputs.record[property];
                    lookup = await sails.models[inputs.model.attributes[property].model].findOne(criteria);
                }
                inputs.record[property] = lookup ? lookup.id : null;
            }
        }

        if (inputs.model.afterEncodeAssociations) {
            await inputs.model.afterEncodeAssociations(inputs.record);
        }

        // Send back the result through the success exit.
        return exits.success(inputs.record);
    }
};
