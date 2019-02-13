/**
 * Visit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        studentName: { model: "Student" },
        checkInTime: { type: "string", required: true, allowNull: false },
        checkOutTime: { type: "string", required: true, allowNull: true },
        visitLength: { type: "string", required: true, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchived: { type: "string", required: true, allowNull: false, isIn: ["Yes", "No", "NotSure"] },
        usedTutor: { boolean: true, required: true, allowNull: false, defaultsTo: false},
        tutor: {type: "string", required: false, allowNull: true},
        comment: { type: "string", required: true, allowNull: false },
        estimatedDuration: {  type: "string", required: true, allowNull: false }
    },

};
