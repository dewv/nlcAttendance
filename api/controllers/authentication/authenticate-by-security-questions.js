module.exports = {
    friendlyName: "Log out",

    description: "Controller action for logging out of the application.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the login form.",
            responseType: "view",
            viewTemplatePath: "pages/authentication/ldapUnavailable"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        let ejsData = { session: { banner: request.session.banner } };

        return exits.success(ejsData);
    }
};
