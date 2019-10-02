/**
 * @name sails&period;helpers&period;getRecordList
 * @description Joins all data association ID's with their corresponding records.
 * @function
 * @argument {Model} model - A Sails model defining the associations, if any.
 * @argument {Records} records - A data record that may contain association domain values that need encoding.
 * @return {Records} The record argument, modified so that any association domain values are replace with their record.
 * @async
 */

/**
  * If model.recordListQuery
  * then use that string
  * else use model.find
  */
module.exports = {
    friendlyName: "Populate associations",

    description: "Replaces all model association ID's with their corresponding records",

    inputs: {
        model: {
            description: "A Sails model defining the associations, if any.",
            type: "ref",
            required: true
        },

        records: {
            description: "A array of records that may contain association domain values that need encoding.",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {
            outputFriendlyName: "Populated associations",
        }
    },

    fn: async function(inputs, exits) {

        if (inputs.model.recordToAssociate) {
            inputs.records = await inputs.model.find().populate(inputs.model.recordToAssociate);
            return exits.success(inputs.records);
            
        } else {
            inputs.records = await inputs.model.find();
            return exits.success(inputs.records);
        }
        // Send back the result through the success exit.
           
    }

};
