/**
 * @name sails&period;helpers&period;getCurrentTime
 * @description Returns the current syncronized time.
 * @function
 * @return {object} A standard Date object.
 */
module.exports = {


    friendlyName: "get Time",


    description: "Returns the current syncronized time.",


    inputs: {},

    exits: {

        success: {
            description: "All done.",
        },

    },
  
    sync: true,

    fn: function (inputs, exits) {
        let time = Date.now();
        return exits.success(time);
    }
};
