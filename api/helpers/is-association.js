/**
 * @name sails&period;helpers&period;isAssociation
 * @description Determines if a model property is an associated model.
 * @function
 * @argument {Object} model - The Sails model to check.
 * @argument {string} propertyName - The name of the model property to check.
 * @return {boolean}
 */
module.exports = {


    friendlyName: "Is association",


    description: "Determines if a model property is an associated model.",


    inputs: {
        model: {
            description: "The Sails model to check.",
            type: "ref",
            required: true
        },
    
        propertyName: {
            description: "The name of the model property to check.",
            type: "string",
            required: true
        }
    },

    exits: {

        success: {
            description: "All done.",
        },

    },
  
    sync: true,

    fn: function (inputs, exits) {
        let property = inputs.model.attributes[inputs.propertyName];
        return exits.success(typeof property !== "undefined" && typeof property.model === "string");
    }
};

