module.exports = {
    friendlyName: "Get a list of Major records",

    description: "Controller action for GETting a list of Major model records.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display a view with the records list.",
            responseType: "view",
            viewTemplatePath: "pages/major/index"
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;

        if (request.session.role !== "staff") throw "unauthorized";

        let ejsData = {
            session: request.session,
        };
        ejsData.records = await Major.find();

        return exits.success(ejsData);
    }
};
