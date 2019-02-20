/**
 * @name sails&period;helpers&period;getCurrentTime
 * @description Returns the current syncronized time.
 * @function
 * @return {object}
 */
module.exports = {


    friendlyName: "Is association",


    description: "Returns the current syncronized time.",


    inputs: {},

    exits: {

        success: {
            description: "All done.",
        },

    },
  
    sync: true,

    fn: function () {
        let time = new Date.now();
        return time;
    }
};
