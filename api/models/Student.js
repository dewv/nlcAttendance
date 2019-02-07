/**
 * @module Student
 * 
 * Usage: `Student` or `sails.models.Student`
 */

module.exports = {
    attributes: {
        username: { type: "string", required: true, allowNull: false, unique: true, isEmail: true },
        firstName: { type: "string", required: true, allowNull: false },
        lastName: { type: "string", required: true, allowNull: false },
        academicRank: { type: "string", required: true, allowNull: false, isIn: ["Freshman", "Sophomore", "Junior", "Senior"] },
        majorOne: { model: "Major" },
        majorTwo: { model: "Major" },
        residentialStatus: { type: "string", required: true, allowNull: false, isIn: ["On campus", "Commuter"] },
        fallSport: { model: "FallSport" },
        springSport: { model: "SpringSport" },
        forceUpdate: { type: "boolean", defaultsTo: true }
    },
};
