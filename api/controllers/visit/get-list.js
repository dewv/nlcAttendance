module.exports = {
    friendlyName: "Get a list of Visit records",

    description: "Controller action for GETting a list of Visit model records.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display a view with the records list.",
            responseType: "view",
            viewTemplatePath: "pages/visit/index"
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        if (request.session.role !== "staff") throw "unauthorized";

        let modelName = "visit";
        let model = sails.models[modelName];

        let ejsData = {
            session: request.session,
            records: await sails.helpers.getRecordList(model, "id DESC")
        };

        return exits.success(ejsData);
    }
};
