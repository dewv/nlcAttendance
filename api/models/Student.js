/**
 * Represents a set of student profile records. 
 * @module 
 * @implements Model
 * @borrows StudentRecord as StudentRecord 
 * @borrows academicRankDomain as academicRankDomain
 * @borrows residentialStatusDomain as residentialStatusDomain
 */
module.exports = {
    attributes: {
        username: { type: "string", required: true, allowNull: false, unique: true, isEmail: true },
        firstName: { type: "string", required: true, allowNull: false },
        lastName: { type: "string", required: true, allowNull: false },
        academicRank: { type: "string", required: false, allowNull: true, isIn: ["Freshman", "Sophomore", "Junior", "Senior"] },
        majorOne: { model: "Major" },
        majorTwo: { model: "Major" },
        residentialStatus: { type: "string", required: false, allowNull: true, isIn: ["On campus", "Commuter"] },
        fallSport: { model: "FallSport" },
        springSport: { model: "SpringSport" },
        forceUpdate: { type: "boolean", defaultsTo: true }
    },
   
    candidateKey: "username",
    
    beforeUpdate: async function(valuesToSet, proceed) {
        valuesToSet.forceUpdate = false;
        return proceed();
    },
    
    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        academicRank: true,
        majorOne: true,
        majorTwo: true,
        residentialStatus: true,
        fallSport: true,
        springSport: true
    },

    /** 
     * Indicates which model attributes are required when a user updates their profile.
     */
    inputRequired: {
        academicRank: true,
        majorOne: true,
        residentialStatus: true,
    },

    testRecords: [],
    
    /**
     * Populates the database with test data for use in development environments.
     * @modifies Database contents.
     * 
     * Note convention: sample data is ALL CAPS, using .net rather than .edu domain
     */
    createTestData: async function() {
        let recordCount = 5;

        // Associations

        // Students. All but first have associations populated.
        for (let i = 0; i < recordCount; i++) {
            this.testRecords.push(await Student.create({
                username: `USERNAME${i + 1}@DEWV.NET`,
                firstName: `FIRSTNAME${i + 1}`,
                lastName: `LASTNAME${i + 1}`,
                academicRank: i === 0 ? null : Student.attributes.academicRank.validations.isIn[i % Student.attributes.academicRank.validations.isIn.length],
                majorOne: i + 1,
                majorTwo: i + 4,
                residentialStatus: i === 0 ? null : Student.attributes.residentialStatus.validations.isIn[i % Student.attributes.residentialStatus.validations.isIn.length],
                fallSport: i + 1,
                springSport: i + 1,
                forceUpdate: Student.attributes.forceUpdate.defaultsTo
            }).fetch());
        }
        for (let i = 0; i < recordCount; i++) {
            this.testRecords.push(await Student.create({
                username: `NoUpdateUser${i + 1}@DEWV.NET`,
                firstName: `NoUpdateFirst${i + 1}`,
                lastName: `NoUpdateLast${i + 1}`,
                academicRank: i === 0 ? null : Student.attributes.academicRank.validations.isIn[i % Student.attributes.academicRank.validations.isIn.length],
                majorOne: i + 1,
                majorTwo: i + 4,
                residentialStatus: i === 0 ? null : Student.attributes.residentialStatus.validations.isIn[i % Student.attributes.residentialStatus.validations.isIn.length],
                fallSport: i + 1,
                springSport: i + 1,
                forceUpdate: false
            }).fetch());
        }
    }
};

/**
 * Domain values for student academic rank. 
 * @typedef {string} academicRankDomain 
 */

/**
 * Domain values for student residential status. 
 * @typedef {string} residentialStatusDomain
 */

/**
 * A student profile record.
 * @typedef {Record} StudentRecord
 * @property {string} username - The student's email address, @dewv.edu.
 * @property {string} firstName - The student's first name.
 * @property {string} lastName - The student's last name.
 * @property {academicRankDomain} academicRank - The student's academic rank.
 * @property {MajorRecord} majorOne - The student's primary major. 
 * @property {MajorRecord} majorTwo - The student's secondary major. 
 * @property {residentialStatusDomain} residentialStatus - The student's residential status.
 * @property {FallSport} fallSport - The student's Fall sport. 
 * @property {SpringSport} springSport - The student's Spring sport. 
 * @property {boolean} forceUpdate=true - Indicates if it is mandatory for the student to update their profile. 
 */
