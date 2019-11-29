module.exports = {
    friendlyName: "Post data to update a Staff record",

    description: "Controller action for POSTing data to update an existing Staff model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After updating a Staff record, redirect to the session's next URL.",
            responseType: "redirect"
        },
        unauthorized: {
            description: "The user is not staff, or the specified record is not their profile.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        // eslint-disable-next-line eqeqeq
        if (request.session.role !== "staff" || request.params.id != request.session.userId) throw "unauthorized";
        let modelName = "staff";

        try {
            await sails.helpers.recordUpdate(modelName, request.params.id, request.body);
            request.session.banner = "Your staff profile was updated.";
        } catch (error) {
            request.banner.message = error.message;
        }

        return exits.success(request.session.nextUrl);
    }
};
