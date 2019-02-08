/**
 * @name sails&period;helpers&period;getAssociationDomains
 * @description Provides domain values for each association.
 * @function
 * @argument {Object} model - A Sails model whose associations are keys in the result dictionary.
 * @return {Object} A dictionary where keys are the model's associations, and values are arrays of domain value strings.
 * @async
*/
module.exports = {

    friendlyName: "Get association domains",

    description: "Provides domain values for each association.",

    inputs: {
        model: {
            description: "A Sails model whose associations are keys in the result dictionary.",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Association domains",
        }
    },

    fn: async function(inputs, exits) {
        let result = {};
        for (let property in inputs.model.attributes) {
            if (sails.helpers.isAssociation(inputs.model, property)) {
                result[property] = await sails.models[inputs.model.attributes[property].model].find().sort("name ASC"); 
            }
        }
        
        // Send back the result through the success exit.
        return exits.success(result);
    }
};
