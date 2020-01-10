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

        request.body.majorOne = await Major.getId(request.body.majorOne);
        request.body.majorTwo = await Major.getId(request.body.majorTwo);

        request.body.sportOne = await Sport.getId(request.body.sportOne);
        request.body.sportTwo = await Sport.getId(request.body.sportTwo);

        request.body.slpInstructor = await Staff.getId(request.body.slpInstructor);

        await Student.updateOne({
            id: request.params.id
        }).set(request.body);

        request.session.banner = "Your student profile was updated.";
        request.session.forceProfileUpdate = false;

        if (request.session.visit.checkOutTime) request.session.nextUrl = "/visit/new";
        else request.session.nextUrl = `/visit/${request.session.visit.id}/edit`;

        return exits.success(request.session.nextUrl);
    }
};
