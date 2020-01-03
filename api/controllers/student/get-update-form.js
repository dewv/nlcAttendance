module.exports = {
    friendlyName: "Get Student update form",

    description: "Controller action for GETting a form to update an existing Student model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the update form.",
            responseType: "view",
            viewTemplatePath: "pages/student/updateForm"
        },
        unauthorized: {
            description: "The user is not a student, or the specified record is not their profile.",
            responseType: "forbidden"
        },
        recordNotFound: {
            description: "The specified record was not found.",
            responseType: "badRequest"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        let modelName = "student";

        // eslint-disable-next-line eqeqeq
        if (request.session.role !== modelName || request.params.id != request.session.userId) throw "unauthorized";

        let model = sails.models[modelName];

        let recordToUpdate = await sails.helpers.populateOne(model, request.params.id);
        /* istanbul ignore next */
        if (!recordToUpdate) throw "recordNotFound";

        let ejsData = await sails.helpers.getDomains(model, recordToUpdate);

        ejsData.academicRank = ejsData.academicRank.replace(/id=\"academicRank\"/, "id=\"academicRank\" autofocus");

        ejsData.session = request.session;
        ejsData.formData = recordToUpdate;
        ejsData.action = `/${modelName}/${request.params.id}`;

        return exits.success(ejsData);
    }
};
