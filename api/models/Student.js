/*
 * @module Student
 * 
 * Usage: `Student` or `sails.models.Student`
 */

module.exports = {
    attributes: {
        name: { type: "string", required: true, allowNull: false, unique: true, isEmail: true },
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

    /**
     * Populates the database with sample data for use in development environments.
     * @modifies Database contents.
     * 
     * Note convention: sample data is ALL CAPS, using .net rather than .edu domain
     */
    createDevelopmentData: async function() {
        let recordCount = 5;

        // Associations
        let ids = {
            major: [],
            fallSport: [],
            springSport: []
        };

        for (let i = 0; i < recordCount; i++) {
            ids.major[i] = await (
                await Major.create({
                    name: `MAJOR ${i + 1}`
                }).fetch()).id;

            ids.fallSport[i] = await (
                await FallSport.create({
                    name: `FALL SPORT ${i + 1}`
                }).fetch()).id;

            ids.springSport[i] = await (
                await SpringSport.create({
                    name: `SPRING SPORT ${i + 1}`
                }).fetch()).id;
        }

        // Students. All but first have associations populated.
        for (let i = 0; i < recordCount; i++) {
            await Student.create({
                name: `USERNAME${i + 1}@DEWV.NET`,
                firstName: `FIRSTNAME${i + 1}`,
                lastName: `LASTNAME${i + 1}`,
                academicRank: i === 0 ? null : Student.attributes.academicRank.validations.isIn[i % Student.attributes.academicRank.validations.isIn.length],
                majorOne: i === 0 ? null : ids.major[i],
                majorTwo: i === 0 ? null : ids.major[(i + 1) % recordCount],
                residentialStatus: i === 0 ? null : Student.attributes.residentialStatus.validations.isIn[i % Student.attributes.residentialStatus.validations.isIn.length],
                fallSport: i === 0 ? null : ids.fallSport[i],
                springSport: i === 0 ? null : ids.springSport[i],
                forceUpdate: Student.attributes.forceUpdate.defaultsTo
            });
        }
    }
};
