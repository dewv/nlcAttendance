/**
 * @name sails&period;helpers&period;getDomains
 * @description Provides domain values for each relevant model attribute, based on association or validations.
 * @function
 * @argument {Model} model - A Sails model whose relevant attributes are keys in the result dictionary.
 * @return {Object} A dictionary where keys are the model's relevant attributes, and values are arrays of domain value strings.
 * @async
 */
module.exports = {

    friendlyName: "Get domains",

    description: "Provides domain values for each relevant attribute, based on association or validations.",

    inputs: {
        model: {
            description: "A Sails model whose relevant attributes are keys in the result dictionary.",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Domains",
        }
    },

    fn: async function(inputs, exits) {
        let result = {};
        if (inputs.model.domainDefined) {
            for (let property in inputs.model.domainDefined) {
                sails.log.debug(JSON.stringify(property));
                result[property] = {}; 
                result[property].inputRequired = property.inputRequired;
                /* istanbul ignore else */
                // if (sails.helpers.isAssociation(inputs.model, property)) {
                //     result[property].options = await sails.models[inputs.model.attributes[property].model].find().sort("name ASC");
                // }
                // else if (inputs.model.attributes[property].validations &&
                //     inputs.model.attributes[property].validations.isIn) {
                //     result[property].options = [];
                //     for (let i = 0; i < inputs.model.attributes[property].validations.isIn.length; i++) {
                //         result[property].options.push({ name: inputs.model.attributes[property].validations.isIn[i] });
                //     }
                // }
                // else {
                //     sails.log.warn(`Unable to find domain values for ${inputs.model.identity}.${property}`);
                // }
            }
        }
        sails.log.debug(JSON.stringify(result))
        // Send back the result through the success exit.
        return exits.success(result);
    }
};
