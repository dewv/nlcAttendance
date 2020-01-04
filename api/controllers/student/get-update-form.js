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

        let ejsData = await sails.helpers.getDomains(Student, recordToUpdate);
        sails.log.debug(JSON.stringify(ejsData))
        ejsData.academicRank = ejsData.academicRank.replace(/id=\"academicRank\"/, "id=\"academicRank\" autofocus");

        ejsData.session = request.session;
        ejsData.formData = recordToUpdate;
        ejsData.action = `/student/${request.params.id}`;

        return exits.success(ejsData);
    }
};
