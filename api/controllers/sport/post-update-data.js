module.exports = {
    friendlyName: "Post data to update a Sport record",

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
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        if (request.session.role !== "staff") throw "unauthorized";

        await Sport.updateOne({
            id: request.params.id
        }).set(request.body);

        return exits.success("/sport");
    }
};
