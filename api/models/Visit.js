/**
 * Visit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        /**
         * The default sails create record time is used for checkInTime.
         * The default sails last updated time is used to calculate visitLength
         */
        studentName: { model: "Student" },
        visitLength: { type: "number", required: false, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", required: true, allowNull: false, isIn: ["Yes", "No", "NotSure"] },
        usedTutor: { type: "boolean", allowNull: false, defaultsTo: false },
        tutor: { type: "string", required: false, allowNull: true },
        comment: { type: "string", required: true, allowNull: false },
        estimatedDuration: { type: "number", allowNull: true }
    },

    beforeUpdate: function(visit, proceed) {
        visit.visitLength = (visit.checkOutTime - visit.checkInTime);
    },

};
