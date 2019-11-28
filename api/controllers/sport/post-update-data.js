module.exports = {
    friendlyName: "Post data to update a Sport model record",

    description: "Controller action for POSTing data to update an existing Sport model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After updating a Sport, redirect client back to Sport page.",
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

        await sails.helpers.recordUpdate(modelName, request.params.id, request.body);
        return exits.success("/sport");
    }
};
