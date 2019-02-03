const fs = require("fs"); // nodejs file system access

module.exports = {

    friendlyName: "Response view safely",

    description: "Sends Web response using specified view template, or sends 404 if template does not exist",

    inputs: {
        response: {
            description: "The Express.js object representing an HTTP response",
            type: "ref",
            required: true
        },

        viewPath: {
            description: "The path (relative to `views` folder) of the requested view template",
            type: "string",
            required: true
        },

        data: {
            description: "Data to be provided to view",
            type: "ref",
            required: false
        }
    },

    exits: {
        success: {
            description: "Response complete",
        },
    },

    fn: async function(inputs, exits) {
        fs.access(`views/${inputs.viewPath}.html`, fs.constants.F_OK, (error) => {
            if (error) return exits.success(inputs.response.notFound());
            return exits.success(inputs.response.view(inputs.viewPath, inputs.data));
        });
    }

};
