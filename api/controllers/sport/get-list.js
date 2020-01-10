module.exports = {
    friendlyName: "Get a list of Sport records",

    description: "Controller action for GETting a list of Sport model records.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display a view with the records lists.",
            responseType: "view",
            viewTemplatePath: "pages/sport/index"
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        },
    },

    fn: async function (inputs, exits) {
        let request = this.req;

        if (request.session.role !== "staff") throw "unauthorized";

        let ejsData = {
            session: request.session,
        };
        ejsData.records = await Sport.find();

        return exits.success(ejsData);
    }
};
