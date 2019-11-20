/**
 * @name sails&period;helpers&period;getCurrentTime
 * @description Returns the current date and time.
 * @function
 * @return {Date} The current time.
 */
module.exports = {
    friendlyName: "Get current time",

    description: "Returns the current date and time.",

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
