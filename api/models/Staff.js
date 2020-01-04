/**
 * Represents a set of staff profile records. 
 * @module 
 * @implements Model
 * @borrows StaffRecord as StaffRecord 
 */
module.exports = {
    attributes: {
        username: { type: "string", required: true, allowNull: false, unique: true },
        firstName: { type: "string", required: true, allowNull: false },
        lastName: { type: "string", required: true, allowNull: false },
        name: { type: "string", allowNull: false }, // kludge to support SLP instructor <select>
        isSlpInstructor: { type: "boolean", allowNull: false, defaultsTo: false },
        forceUpdate: { type: "boolean", defaultsTo: true }
    },

    candidateKey: "username",

    beforeUpdate: async function (valuesToSet, proceed) {
        valuesToSet.forceUpdate = false;
        return proceed();
    },

    getId: async function (name) {
        if (name.length === 0) return null;

        let record = await Staff.findOne({ name: name });
        if (record) return record.id;

        return null;
    },

    testRecords: [],

    /**
     * Populates the database with test data for use in development environments.
     * @modifies Database contents.
     * @async
     * 
     * Note convention: sample data is ALL CAPS, using .net rather than .edu domain
     */
    createTestData: async function () {
        let recordCount = 5;

        for (let i = 0; i < recordCount; i++) {
            this.testRecords.push(await Staff.create({
                username: `STAFFUSERNAME${i + 1}@DEWV.NET`,
                firstName: `STAFFFIRSTNAME${i + 1}`,
                lastName: `STAFFLASTNAME${i + 1}`,
                name: `STAFFFIRSTNAME${i + 1} STAFFLASTNAME${i + 1}`,
                isSlpInstructor: i % 2 === 0,
                forceUpdate: i === 4 ? false : Staff.attributes.forceUpdate.defaultsTo
            }).fetch());
        }
    }
};

/**
 * A staff profile record.
 * @typedef {Record} StaffRecord
 * @property {string} username - The staff member's email address.
 * @property {string} firstName - The staff member's first name.
 * @property {string} lastName - The staff member's last name.
 * @property {boolean} isSlpInstructor - Indicates if the staff member is an SLP instructor.
 * @property {boolean} forceUpdate=true - Indicates if it is mandatory for the user to update their profile.
 */
