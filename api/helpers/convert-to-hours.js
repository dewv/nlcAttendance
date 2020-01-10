/**
 * @name sails&period;helpers&period;convertToHours
 * @description Returns the number of hours rounded to the nearest quarter hour based on milliseconds.
 * @function
 * @argument {number} duration - A time span in milliseconds. 
 * @return {number} The duration in hours, to the nearest quarter-hour. 
 */
module.exports = {
    friendlyName: "Convert milliseconds to nearest quarter-hour",

    description: "Returns the duration converted to hours rounded to nearest quarter hour.",

    inputs: {
        duration: {
            description: "A time span in milliseconds.",
            type: "number",
            required: true,
        },
    },

    exits: {
        success: {
            description: "All done.",
        },
    },

    sync: true,

    fn: function (inputs, exits) {
        let rawHours = inputs.duration / 3600000;
        let hours = parseFloat((Math.round(rawHours * 4) / 4).toFixed(2));
        return exits.success(hours);
    }
};
