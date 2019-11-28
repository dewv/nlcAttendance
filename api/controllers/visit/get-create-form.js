module.exports = {
    friendlyName: "Get Visit create form",

    description: "Controller action for GETting a form to create a new Visit model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the create form.",
            responseType: "view",
            viewTemplatePath: "pages/visit/createForm"
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
        if (!request.cookies.location) throw { unregisteredBrowser: profileUrl };
        if (request.session.forceProfileUpdate) throw { mustUpdateProfile: profileUrl };
        if (!request.session.visit.checkOutTime) throw "alreadyCheckedIn";

        let modelName = "visit";
        let model = sails.models[modelName];

        let ejsData = await sails.helpers.getDomains(model);
        ejsData.session = request.session;
        ejsData.formData = await sails.helpers.getDefaults(model);
        ejsData.action = `/${modelName}`;

        return exits.success(ejsData);
    }
};
