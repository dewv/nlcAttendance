/**
 * Visit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: { model: "Student" },
        checkInTime: { type: "string", allowNull: false },
        checkOutTime: { type: "string", allowNull: true },
        visitLength: { type: "number", required: false, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", required: true, allowNull: false, isIn: ["Yes", "No", "NotSure"] },
        usedTutor: { type: "boolean", allowNull: false, defaultsTo: false },
        tutor: { type: "string", required: false, allowNull: true },
        comment: { type: "string", required: true, allowNull: false },
        needEstimate: { type: "boolean", allowNull: false, defaultsTo: false },
        estimatedDuration: { type: "number", allowNull: true }
    },

    beforeCreate: function(visit, proceed) {
        visit.checkInTime = Date.now();
        return proceed;
    },

    beforeUpdate: function(visit, proceed) {
        visit.checkOutTime = Date.now();
        let elapsed = visit.checkOutTime.getHours - visit.checkInTime.getHours;
        let difference = Date(elapsed);
        visit.visitLength = difference.getHours() + " " + difference.getMinutes();
        if (visit.visitLength > 5) {
            visit.needEstimate = true;
        }
        return proceed;
    },

};
