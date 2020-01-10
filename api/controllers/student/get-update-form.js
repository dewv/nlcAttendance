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

        // eslint-disable-next-line eqeqeq
        if (request.session.role !== "student" || request.params.id != request.session.userId) throw "unauthorized";

        let recordToUpdate = await Student.findOne({ id: request.params.id })
            .populate("majorOne")
            .populate("majorTwo")
            .populate("sportOne")
            .populate("sportTwo")
            .populate("slpInstructor");

        /* istanbul ignore next */
        if (!recordToUpdate) throw "recordNotFound";

        let ejsData = {
            session: request.session,
            formData: recordToUpdate,
            action: `/student/${request.params.id}`,
            options: await Student.getOptions(recordToUpdate)
        };

        return exits.success(ejsData);
    }
};
