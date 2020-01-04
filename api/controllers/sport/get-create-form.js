module.exports = {
    friendlyName: "Get Sport create form",

    description: "Controller action for GETting a form to create a new Sport model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the create form.",
            responseType: "view",
            viewTemplatePath: "pages/sport/createForm"
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;

        if (request.session.role !== "staff") throw "unauthorized";

        let ejsData = await sails.helpers.getDomains(Sport);
        ejsData.session = request.session;
        ejsData.formData = Sport.getDefaults();
        ejsData.action = "/sport";

        return exits.success(ejsData);
    }
};
