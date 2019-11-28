module.exports = {
    friendlyName: "Get Staff update form",

    description: "Controller action for GETting a form to update an existing Staff model record.",

    inputs: {
    },

    exits: {
        success: {
            description: "Display the update form.",
            responseType: "view",
            viewTemplatePath: "pages/staff/updateForm"
        },
        unauthorized: {
            description: "The user is not staff, or the specified record is not their profile.",
            responseType: "forbidden"
        },
        recordNotFound: {
            description: "The specified record was not found.",
            responseType: "badRequest"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        // eslint-disable-next-line eqeqeq
        if (request.session.role !== "staff" || request.params.id != request.session.userId) throw "unauthorized";

        let modelName = "staff";
        let model = sails.models[modelName];

        let recordToUpdate = await sails.helpers.populateOne(model, request.params.id);
        /* istanbul ignore next */
        if (!recordToUpdate) throw "recordNotFound";

        let ejsData = {
            session: request.session,
            formData: recordToUpdate,
            action: `/${modelName}/${request.params.id}`
        };

        return exits.success(ejsData);
    }
};
