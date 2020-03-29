/**
 * An academic major.
 */
module.exports = {
    attributes: {
        name: { type: "string", required: true, unique: true, },
        discontinued: { type: "string", defaultsTo: "No", isIn: ["Yes", "No"] },
    },

    getId: async function (name) {
        if (!name || !name.length) return null;

        let record = await Major.findOne({ name: name });
        if (record) return record.id;

        return null;
    },

    getDefaults: function () {
        return {
            name: "",
            discontinued: Major.attributes.discontinued.defaultsTo
        };
    },

    createData: async function () {
        let majors = [
            "Accounting",
            "Adventure Recreation",
            "Appalachian Studies",
            "Art",
            "Biology",
            "Business",
            "Chemistry",
            "Child and Family Studies",
            "Computer Science",
            "Criminal Justice",
            "Criminology",
            "Dance",
            "Design and Technical Theatre",
            "Early Childhood Education",
            "Economics",
            "Education",
            "English",
            "Environmental Science",
            "Exercise Science",
            "Finance",
            "History",
            "Hospitality Management",
            "Management",
            "Marketing",
            "Mathematics",
            "Music",
            "Nursing",
            "Physical Education",
            "Political Science",
            "Pre-Dental",
            "Pre-Law",
            "Pre-Medical",
            "Pre-Ministerial",
            "Pre-Pharmacy",
            "Pre-Physical Therapy",
            "Pre-Veterinary",
            "Psychology and Human Services",
            "Religion and Philosophy",
            "Sociology",
            "Sport Management",
            "Sustainability Studies",
            "Theatre Arts",
        ];

        for (let i = 0; i < majors.length; i++) {
            await Major.create({ name: majors[i] });
        }
    },

};
