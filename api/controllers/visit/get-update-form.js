module.exports = {
    friendlyName: "Get Visit update form",

    description: "Controller action for GETting a form to update an existing Visit model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the update form.",
            responseType: "view",
            viewTemplatePath: "pages/visit/updateForm"
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
        },
        recordNotFound: {
            description: "The specified record was not found.",
            responseType: "badRequest"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        let modelName = "visit";
        // eslint-disable-next-line eqeqeq
        if (request.session.role !== "student" || request.params.id != request.session.visit.id) throw "unauthorized";
        let profileUrl = `/student/${request.session.userId}/edit`;
        if (!request.cookies.location) throw { unregisteredBrowser: profileUrl };
        if (request.session.forceProfileUpdate) throw { mustUpdateProfile: profileUrl };
        if (request.session.visit.checkOutTime) throw "alreadyCheckedOut";

        let model = sails.models[modelName];

        let recordToUpdate = await sails.helpers.populateOne(model, request.params.id);
        /* istanbul ignore next */
        if (!recordToUpdate) throw "recordNotFound";

        let ejsData = await sails.helpers.getDomains(model, recordToUpdate);

        ejsData.purposeAchieved = ejsData.purposeAchieved.replace(/id=\"purposeAchieved\"/, "id=\"purposeAchieved\" autofocus");

        ejsData.session = request.session;
        ejsData.formData = recordToUpdate;
        ejsData.action = `/${modelName}/${request.params.id}`;

        return exits.success(ejsData);
    }
};
