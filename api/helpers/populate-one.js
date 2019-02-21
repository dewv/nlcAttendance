/**
 * @name sails&period;helpers&period;populateOne
 * @description Retrieves attributes and populates all associations for a specified ID.
 * @function
 * @argument {Model} model - A Sails model defining the attributes and associations.
 * @argument {number} id - The ID/key of the desired data record.
 * @return {Record} A data record with all associations populated.
 * @async
 */
module.exports = {

    friendlyName: "populateOne",

    description: "Retrieves attributes and populates all associations for a specified ID.",

    inputs: {
        model: {
            description: "A Sails model defining the attributes and associations.",
            type: "ref",
            required: true
        },

        id: {
            description: "The ID/key of the desired data record.",
            type: "number",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Populated record",
        }
    },

    fn: async function(inputs, exits) {
        let result = await inputs.model.findOne({ id: inputs.id });
        for (let property in inputs.model.attributes) {
            if (sails.helpers.isAssociation(inputs.model, property)) {
                let lookup = await sails.models[inputs.model.attributes[property].model].findOne({ id: result[property] });
                result[property] = lookup ? lookup : null;
            }
        }

        // Send back the result through the success exit.
        return exits.success(result);
    }
};
