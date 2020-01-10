/**
 * A staff user's profile. 
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
