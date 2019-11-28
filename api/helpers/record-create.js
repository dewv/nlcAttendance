module.exports = {
    friendlyName: "Create a new data record",

    description: "Creates a new record using the specified model and data.",

    inputs: {
        model: {
            description: "The name of a sails model",
            type: "string",
            required: true
        },
        data: {
            description: "The data for the new record",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            description: "A new data record was created."
        }
    },

    fn: async function (inputs, exits) {
        let model = sails.models[inputs.model];
        let encodedData = await sails.helpers.encodeAssociations(model, inputs.data);
        await model.create(encodedData);
        return exits.success();
    }
};
