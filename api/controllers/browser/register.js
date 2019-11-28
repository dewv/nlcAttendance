module.exports = {
    friendlyName: "Register browser",

    description: "Controller action for GETting a form to register the browser.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display browser registration form.",
            responseType: "view",
            viewTemplatePath: "pages/browser/registerForm"
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        if (request.session.role !== "staff") throw "unauthorized";
        return exits.success();
    }
};
