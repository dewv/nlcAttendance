/**
 * Represents a set of academic major records. 
 * @module 
 * @implements Model
 * @borrows MajorRecord as MajorRecord 
 */
module.exports = {

    attributes: {
        name: { type: "string", required: true, unique: true,},
        discontinued: {type: "string", defaultsTo: "No", isIn: ["Yes", "No"]},
    },
    
    candidateKey: "name",

    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        discontinued: true,
    },

    /** 
     * Indicates which model attributes are required when a user updates a major.
     */
    inputRequired: {
        discontinued: true,
    },

    createData: async function() {
        let majors = {
            name: [
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
            ]
        };

        for (let i = 0; i < major.name.length(); i++) {
            await Major.create({ name: majors.name[i],})
        };
    },
 
};

/**
 * An academic major record.
 * @typedef {Record} MajorRecord
 * @property {string} name - The major's name.
 * @property {boolean} discontinued - Does the major show up in select options.
 */
