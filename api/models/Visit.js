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
        name: { model: "Student" },
        checkInTime: { type: "string", required: true, allowNull: false },
        checkOutTime: { type: "string", allowNull: true },
        visitLength: { type: "number", required: false, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", required: true, allowNull: false, isIn: ["Yes", "No", "NotSure"] },
        usedTutor: { type: "boolean", allowNull: false, defaultsTo: false },
        tutor: { type: "string", required: false, allowNull: true },
        comment: { type: "string", required: true, allowNull: false },
        estimatedDuration: { type: "number", allowNull: true }
    },
    
    beforeCreate: function(visit, proceed) {
        visit.checkInTime = new Date.now();
        return proceed;
    },

    beforeUpdate: function(visit, proceed) {
        visit.checkOutTime = new Date.now();
        let elapsed = visit.checkOutTime.getHours - visit.checkInTime.getHours;
        let difference = new Date(elapsed);
        visit.visitLength = difference.getHours() + " " + difference.getMinutes();
        return proceed;
    },

};
