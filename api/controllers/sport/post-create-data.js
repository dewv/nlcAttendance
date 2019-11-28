module.exports = {
    friendlyName: "Post data to create a model for some Sport model",

    description: "Controller action for POSTing data to create a new Sport model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After creating a Sport, redirect client back to create another.",
            responseType: "redirect"
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

        let modelName;
        if (request.params.season === "fall") modelName = "fallsport";
        else if (request.params.season === "spring") modelName = "springsport";
        else throw "invalidSeason";

        await sails.helpers.recordCreate(modelName, request.body);
        return exits.success("/sport");
    }
};
