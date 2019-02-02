module.exports = {

    friendlyName: 'Get blank record',

    description: 'Generate a data record with "empty" values for model attributes, appropriate for populating create form.',

    inputs: {
        model: {
            description: "A sails model whose attributes define the structure of the blank record",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: 'Blank record',
        }
    },

    fn: async function(inputs, exits) {
        let result = {};
        for (let property in inputs.model.attributes) {
            if (inputs.model.attributes[property].defaultsTo) result[property] = inputs.model.attributes[property].defaultsTo;
            else if (inputs.model.attributes[property].model) result[property] = { name: "Choose one ..." };
            else if (inputs.model.attributes[property].type === "string") result[property] = "";
            else if (inputs.model.attributes[property].type === "boolean") result[property] = false;
            else if (inputs.model.attributes[property].type === "number") result[property] = 0;
            else if (inputs.model.attributes[property].type === "ref") sails.log.warn("found ref: " + JSON.stringify(inputs.model.attributes[property]));
            else if (inputs.model.attributes[property].type === "json") sails.log.warn("found json: " + JSON.stringify(inputs.model.attributes[property]));
        }

        // Send back the result through the success exit.
        return exits.success(result);
    }
};
