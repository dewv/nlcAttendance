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

        let ejsData = {
            session: request.session,
        };
        ejsData.records = await Visit.find().sort("checkInTime DESC").populate("student");

        return exits.success(ejsData);
    }
};
