module.exports = {
    friendlyName: "Post data to update a Student record",

    description: "Controller action for POSTing data to update an existing Student model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After updating a Student record, redirect to the session's next URL.",
            responseType: "redirect"
        },
        unauthorized: {
            description: "The user is not a student, or the specified record is not their profile.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        // eslint-disable-next-line eqeqeq
        if (request.session.role !== "student" || request.params.id != request.session.userId) throw "unauthorized";

        await sails.helpers.recordUpdate("student", request.params.id, request.body);
        request.session.forceProfileUpdate = false;

        if (request.session.visit.checkOutTime) request.session.nextUrl = "/visit/new";
        else request.session.nextUrl = `/visit/${request.session.visit.id}/edit`;

        request.session.banner = "Your student profile was updated.";
        return exits.success(request.session.nextUrl);
    }
};
