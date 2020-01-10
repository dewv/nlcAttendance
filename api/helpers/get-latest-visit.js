module.exports = {
    friendlyName: "Get latest visit",

    description: "Get the student user's most recent Visit record",

    inputs: {
        studentId: {
            description: "A unique identifier for the user's Student record",
            type: "string",
            required: true
        }
    },

    exits: {
        success: {
            description: "The student's most recent Visit"
        }
    },

    fn: async function (inputs, exits) {
        let visit = await Visit.find({
            where: {
                student: inputs.studentId
            },
            limit: 1,
            sort: "checkInTime DESC"
        });

        return exits.success(visit[0] || { checkOutTime: true });
    }
};
