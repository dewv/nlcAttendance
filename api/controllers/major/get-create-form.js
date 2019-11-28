module.exports = {
    friendlyName: "Get Major create form",

    description: "Controller action for GETting a form to create a new Major model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the create form.",
            responseType: "view",
            viewTemplatePath: "pages/major/createForm"
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

        let ejsData = await sails.helpers.getDomains(model);
        ejsData.session = request.session;
        ejsData.formData = await sails.helpers.getDefaults(model);
        ejsData.action = `/${modelName}`;


        return exits.success(ejsData);
    }
};
