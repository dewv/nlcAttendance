module.exports = {
    friendlyName: "Update a data record",

    description: "Updates an existing record using the specified model, ID, and data.",

    inputs: {
        model: {
            description: "The name of a sails model",
            type: "string",
            required: true
        },
        id: {
            description: "The unique identifier of an existing record",
            type: "string",
            required: true
        },
        data: {
            description: "The updated data for the record",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            description: "The existing data record was updated."
        }
    },

    fn: async function (inputs, exits) {
        let model = sails.models[inputs.model];
        let encodedData = await sails.helpers.encodeAssociations(model, inputs.data);

        await model.updateOne({
            id: inputs.id
        }).set(encodedData);

        return exits.success();
    }
};
