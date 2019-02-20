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
        purposeAchieved: { type: "string", allowNull: true, isIn: ["Yes", "No", "Not sure"] },
        tutorCourses: { type: "string", required: false, allowNull: true },
        comment: { type: "string", allowNull: true },
        needEstimate: { type: "boolean", allowNull: false, defaultsTo: false },
        estimatedDuration: { type: "number", allowNull: true }
    },
    
    postPopulate: function(visit) {
        let checkInMins = new Date.getMinutes(visit.checkInTime);
        let checkOutTime = sails.helpers.getCurrentTime();
        let checkOutMins = new Date.getMinutes(checkOutTime);
        visit.visitLength = checkOutMins - checkInMins;
        if (visit.visitLength > 300) {
            visit.needEstimate = true;
        }
        return visit;
    },
    

};


/**
 * A student visit record.
 * @typedef {Record} VisitRecord
 * @property {Student} name - The associated student record.
 * @property {ref} checkInTime - A reference to createdAt formated in UTC.
 * @property {ref} checkOutTime - A reference to updatedAt formated in UTC.
 * @property {number} visitLength - The number of minutes the student was at the NLC. The difference between the checkOutTime and CheckInTime.
 * @property {string} visitPurpose - The reason the student visited the NLC.
 * @property {string} purposeAchieved - Did the student accomplish their goal this visit.
 * @property {string} tutorCourses - The course of which the student used a tutor.
 * @property {string} comment - Any comments the student may have about their visit.
 * @property {boolean} needEstimate=false - Indicates if it is mandatory for the student to estimate the length of their last visit. 
 * @property {number} estimatedDuration - The amount of time, in minutes, the student estimates they were at the NLC on their last visit.
 */
