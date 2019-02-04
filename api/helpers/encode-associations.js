/**
 * @module encode-association
 * 
 * Usage: `sails.helpers.encodeAssociations(model, record);`
 */
 
module.exports = {

    friendlyName: "Encode associations",

    description: "Replaces user-entered association domain values with their corresponding ID/key.",

    inputs: {
        model: {
            description: "A sails model defining the associations, if any",
            type: "ref",
            required: true
        },

        record: {
            description: "A data record that may contain association domain values that need encoding",
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
                inputs.record[property] = lookup ? lookup.id : null;
            }
        }

        // Send back the result through the success exit.
        return exits.success(inputs.record);
    }
};
