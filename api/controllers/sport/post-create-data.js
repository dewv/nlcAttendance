module.exports = {
    friendlyName: "Post data to create a Sport record",

    description:
        "Controller action for POSTing data to create a new Sport record.",

    inputs: {},

    exits: {
        success: {
            description:
                "After creating a Sport, redirect client back to create another.",
            responseType: "redirect",
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden",
        },
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        if (request.session.role !== "staff") throw "unauthorized";

        request.session.banner = "New sport added.";

        try {
            await Sport.create(request.body);
        } catch (error) {
            request.session.banner = error.message;
            request.session.bannerClass = "alert-danger";
        }

        return exits.success("/sport");
    },
};
