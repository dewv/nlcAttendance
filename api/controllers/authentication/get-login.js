module.exports = {
    friendlyName: "GET /login",

    description: "Controller action for GET /login",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the login form.",
            responseType: "view",
            viewTemplatePath: "pages/authentication/loginForm"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        let ejsData = {
            session: {
                banner: request.session.banner,
                bannerClass: request.session.bannerClass
            }
        };
        request.session.destroy();

        return exits.success(ejsData);
    }
};
