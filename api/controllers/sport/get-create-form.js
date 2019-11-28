module.exports = {
    friendlyName: "Get create form for some Sport model",

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
        },
        invalidSeason: {
            description: "The request URL was for something other than `fallsport` or `springsport`.",
            responseType: "badRequest"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        if (request.session.role !== "staff") throw "unauthorized";

        let season;
        if (request.params.season === "fall") season = "Fall";
        else if (request.params.season === "spring") season = "Spring";
        else throw "invalidSeason";

        let modelName = `${request.params.season}sport`;
        let model = sails.models[modelName];

        let ejsData = await sails.helpers.getDomains(model);
        ejsData.session = request.session;
        ejsData.formData = await sails.helpers.getDefaults(model);
        ejsData.action = `/sport/${request.params.season}`;
        ejsData.season = season;

        return exits.success(ejsData);
    }
};
