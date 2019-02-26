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
        checkOutTime: { type: "ref", columnType: "timestamp", autoUpdatedAt: false },
        visitLength: { type: "number", required: false, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", allowNull: true, isIn: ["Yes", "No", "Not sure"] },
        tutorCourses: { type: "string", required: false, allowNull: true },
        comment: { type: "string", allowNull: true },
        isLengthEstimated: { type: "boolean", allowNull: false, defaultsTo: false },
    },

    afterPopulateOne: function(visit) {
        let checkIn = new Date(visit.checkInTime);
        let checkOutTime;
        if (visit.checkOutTime === "0000-00-00 00:00:00") {
            checkOutTime = new Date(sails.helpers.getCurrentTime());
        } else {
            checkOutTime = new Date(visit.checkOutTime);
        }
        visit.visitLength = checkOutTime.getTime() - checkIn.getTime();
        visit.visitLength = sails.helpers.convertToHours(visit.visitLength);
        if (visit.visitLength >= 5) {
            visit.isLengthEstimated = true;
        }
        return visit;
    },

};


/**
 * A student visit record.
 * @typedef {Record} VisitRecord
 * @property {Student} name - The associated student record.
 * @property {ref} checkInTime - A reference to createdAt formated in UTC.
 * @property {ref} checkOutTime - A timestamp in UTC used to calculate visitLength, defaults to '0000-00-00 00:00:00'.
 * @property {number} visitLength - The number of hours, to the nearest quarter hour, the student was at the NLC. The difference between the checkOutTime and CheckInTime.
 * @property {string} visitPurpose - The reason the student visited the NLC.
 * @property {string} purposeAchieved - Did the student accomplish their goal this visit.
 * @property {string} tutorCourses - The course of which the student used a tutor.
 * @property {string} comment - Any comments the student may have about their visit.
 * @property {boolean} isLengthEstimated=false - Indicates if it is mandatory for the student to estimate the length of their last visit when the value is true. 
 */
