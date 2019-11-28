module.exports = {
    friendlyName: "Post data to create a Major record",

    description: "Controller action for POSTing data to create a new Major record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After creating a Major, redirect client back to create another.",
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

        await sails.helpers.recordCreate("major", request.body);
        return exits.success("/major");
    }
};
