/**
 * @name sails&period;helpers&period;convertToHours
 * @description Returns the current syncronized time.
 * @function
 * @return {object}
 */
module.exports = {


    friendlyName: "Is association",


    description: "Returns the current syncronized time.",


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
        let rawHours = inputs.time / (3.6 * 10^6);
        let hours = (Math.round(rawHours * 4) / 4).toFixed(2);
        return hours;
    }
};
