/**
 * @name sails&period;helpers&period;getRecordList
 * @description Retrieves a model's records, with association populated. 
 * @function
 * @argument {Model} model - A Sails model defining the association, if any.
 * @return {Record[]} The model's records, modified so that any association domain values are replaced with their record.
 * @async
 */
module.exports = {
    friendlyName: "Get record list",

    description: "Get list of records, with association populated.",

    inputs: {
        model: {
            description: "A Sails model defining the associations, if any.",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Record list",
        }
    },

    fn: async function (inputs, exits) {
        if (inputs.model.recordToAssociate) {
            inputs.records = await inputs.model.find().populate(inputs.model.recordToAssociate);
        } else {
            inputs.records = await inputs.model.find();
        }
        return exits.success(inputs.records);
    }
};
