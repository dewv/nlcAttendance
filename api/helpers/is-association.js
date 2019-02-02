module.exports = {


  friendlyName: 'Is association',


  description: 'Determines if a model property is an associated model',


  inputs: {
    model: {
      description: "The sailsjs model to check",
      type: "ref",
      required: true
    },
    
    propertyName: {
      description: "The name of the model property to check",
      type: "string",
      required: true
    }

  },

  exits: {

    success: {
      description: 'All done.',
    },

  },
  
  sync: true,

  fn: function (inputs, exits) {
    let property = inputs.model.attributes[inputs.propertyName];
    if (typeof property === "undefined") return exits.success(false);
    return exits.success(typeof property.model === "string");
  }

};

