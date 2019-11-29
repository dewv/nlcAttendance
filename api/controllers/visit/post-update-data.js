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
        let modelName = "visit";

        try {
            await sails.helpers.recordUpdate(modelName, request.params.id, request.body);
            request.session.banner = "You are now checked out. Thanks for visiting Naylor Learning Center.";
        } catch (error) {
            request.banner.message = error.message;
        }

        return exits.success("/logout");
    }
};
