/**
 * @name sails&period;helpers&period;responseViewSafely
 * @description Responds with an HTML page, or 404 error if view template does not exist.
 * @function
 * @argument {Object} response - The Express/Sails object representing an HTTP response.
 * @argument {string} pathToView - The path to the desired view file relative to your app's views folder (usually views/), without the file extension, and with no trailing slash.
 * @argument {Object} [locals] - Data to pass to the view template. 
 * @see {@link https://sailsjs.com/documentation/reference/response-res/res-view}, which throws server error if view template does not exist.
 */
const fs = require("fs"); // nodejs file system access

module.exports = {

    friendlyName: "Response view safely",

    description: "Responds with an HTML page, or 404 error if view template does not exist.",

    inputs: {
        response: {
            description: "The Express/Sails object representing an HTTP response.",
            type: "ref",
            required: true
        },

        pathToView: {
            description: "The path to the desired view file relative to your app's views folder (usually views/), without the file extension, and with no trailing slash.",
            type: "string",
            required: true
        },

        locals: {
            description: "Data to pass to the view template.",
            type: "ref",
            required: false
        }
    },
    
    sync: true,

    exits: {
        success: {
            description: "Response complete",
        },
    },

    fn: function(inputs, exits) {
        fs.access(`views/${inputs.pathToView}.html`, fs.constants.F_OK, (error) => {
            if (error) return exits.success(inputs.response.notFound());
            return exits.success(inputs.response.view(inputs.pathToView, inputs.locals));
        });
    }

};
