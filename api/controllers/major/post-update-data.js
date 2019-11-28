module.exports = {
    friendlyName: "Post data to update a Major record",

    description: "Controller action for POSTing data to update an existing Major model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After updating a Major, redirect client back to Majors page.",
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

        await sails.helpers.recordUpdate("major", request.params.id, request.body);
        return exits.success("/major");
    }
};
