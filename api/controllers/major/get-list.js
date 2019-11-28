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

        let modelName = "major";
        let model = sails.models[modelName];

        let ejsData = {
            session: request.session,
            records: await sails.helpers.getRecordList(model)
        };

        return exits.success(ejsData);
    }
};
