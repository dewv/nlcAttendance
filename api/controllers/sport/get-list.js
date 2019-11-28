module.exports = {
    friendlyName: "Get a list of records for both Sport models",

    description: "Controller action for GETting a list of model records.",

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
            springSport: await sails.helpers.getRecordList(sails.models.springsport),
            fallSport: await sails.helpers.getRecordList(sails.models.fallsport)
        };

        return exits.success(ejsData);
    }
};
