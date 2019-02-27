/**
 * @name sails&period;helpers&period;convertToHours
 * @description Returns the number of hours rounded to the nearest quarter hour based on milliseconds.
 * @function
 * @arguement {number} The number of milliseconds.
 * @return {number} The converted number, milliseconds to hours.
 */
module.exports = {


    friendlyName: "Is association",


    description: "Returns the time converted to hours rounded to nearest quarter hour.",


    inputs: {
        time: {
            description: "A epoch number in milliseconds.",
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

    fn: function(inputs) {
        let rawHours = inputs.time / 3600000;
        let hours = (Math.round(rawHours * 4) / 4).toFixed(2);
        return hours;
    }
};
