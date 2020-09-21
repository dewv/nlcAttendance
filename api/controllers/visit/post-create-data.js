module.exports = {
    friendlyName: "Post data to create a Visit record",

    description: "Controller action for POSTing data to create a new Visit record.",

    inputs: {
    },

    exits: {
        success: {
            description: "After creating a Visit, log out the client.",
            responseType: "redirect"
        },
        missingUserRole: {
            description: "The user is not a student.",
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
        alreadyCheckedIn: {
            description: "The user is currently checked in, and must check out.",
            responseType: "badRequest"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;

        if (request.session.role !== "student") throw "missingUserRole";

        let profileUrl = `/student/${request.session.userId}/edit`;
        if (sails.config.custom.restrictBrowsers) {
            if (!request.cookies.location) throw { unregisteredBrowser: profileUrl };
        };
        if (request.session.forceProfileUpdate) throw { mustUpdateProfile: profileUrl };
        if (!request.session.visit.checkOutTime) throw "alreadyCheckedIn";

        request.body.student = request.session.userId;
        request.body.location = request.cookies.location;

        await Visit.create(request.body);

        request.session.banner = `${request.session.firstName} ${request.session.lastName} is now checked in. Please remember to check out before leaving.`;

        return exits.success("/logout");
    }
};
