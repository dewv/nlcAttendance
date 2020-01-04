module.exports = {
    friendlyName: "Post data to update a Visit record",

    description: "Controller action for POSTing data to update an existing Visit model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After updating a Visit, log out the client.",
            responseType: "redirect"
        },
        unauthorized: {
            description: "The user is not a student, or the Visit is not theirs.",
            responseType: "forbidden"
        },
        unregisteredBrowser: {
            description: "The browser is not registered for check in and check out.",
            responseType: "redirect"
        },
        mustUpdateProfile: {
            description: "The student must update their profile before any other request.",
            responseType: "redirect"
        },
        alreadyCheckedOut: {
            description: "The user is currently checked out, and must check in.",
            responseType: "badRequest"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;

        // eslint-disable-next-line eqeqeq
        if (request.session.role !== "student" || request.params.id != request.session.visit.id) throw "unauthorized";

        let profileUrl = `/student/${request.session.userId}/edit`;
        if (!request.cookies.location) throw { unregisteredBrowser: profileUrl };
        if (request.session.forceProfileUpdate) throw { mustUpdateProfile: profileUrl };
        if (request.session.visit.checkOutTime) throw "alreadyCheckedOut";

        request.body.checkOutTime = new Date(sails.helpers.getCurrentTime());

        if (request.body.length) {
            // Estimated length may be posted with form ...
            request.body.isLengthEstimated = true;
        } else {
            // ... or it may be calculated.
            request.body.isLengthEstimated = false;
            let current = await Visit.find({
                where: {
                    student: request.session.userId
                },
                limit: 1,
                sort: "checkInTime DESC"
            });
            request.body.checkInTime = current[0].checkInTime;
            request.body.length = ((new Date(request.body.checkOutTime)).getTime()) - ((new Date(request.body.checkInTime)).getTime());
            request.body.length = sails.helpers.convertToHours(request.body.length);
        }

        await Visit.updateOne({
            id: request.params.id
        }).set(request.body);

        request.session.banner = `${request.session.firstName} ${request.session.lastName} is now checked out. Thanks for visiting Naylor Learning Center.`;

        return exits.success("/logout");
    }
};
