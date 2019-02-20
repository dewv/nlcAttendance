/**
 * Visit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: { model: "Student" },
        checkInTime: { type: "ref", columnType: "timestamp", autoCreatedAt: true },
        checkOutTime: { type: "ref", columnType: "timestamp", autoUpdatedAt: true },
        visitLength: { type: "number", required: false, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", allowNull: true, isIn: ["Yes", "No", "NotSure"] },
        usedTutor: { type: "boolean", allowNull: false, defaultsTo: false },
        tutor: { type: "string", required: false, allowNull: true },
        comment: { type: "string", allowNull: true },
        needEstimate: { type: "boolean", allowNull: false, defaultsTo: false },
        estimatedDuration: { type: "number", allowNull: true }
    },
    
    beforeUpdate: function(visit, proceed) {
        visit.checkInTime = new Date.getMinutes(visit.checkInTime);
        visit.checkOutTime = new Date.getMinutes(visit.checkOutTime);
        visit.visitLength = visit.checkOutTime - visit.checkInTime;
        if (visit.visitLength > 300) {
            visit.needEstimate = true;
        }
        return proceed;
    },

};
