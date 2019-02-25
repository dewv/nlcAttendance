/**
 * @name sails&period;helpers&period;convertToHours
 * @description Returns the current syncronized time.
 * @function
 * @return {object}
 */
module.exports = {


    friendlyName: "Is association",


    description: "Returns the time converted to hours rounded to nearest quarter hour.",


    inputs: {
        time: {
            description: "A epoch number.",
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
        console.log(rawHours);
        let hours = (Math.round(rawHours * 4) / 4).toFixed(2);
        console.log(hours);
        return hours;
    }
};
