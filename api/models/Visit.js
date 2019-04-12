/**
 * Visit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: { model: "Student" },
        checkInTime: { type: "string", columnType: "datetime", autoCreatedAt: true },
        checkOutTime: { type: "string", columnType: "datetime", allowNull: true },
        visitLength: { type: "number", required: false, allowNull: true },
        visitPurpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", allowNull: true, isIn: ["Yes", "No", "Not sure"] },
        tutorCourses: { type: "string", required: false, allowNull: true },
        comment: { type: "string", allowNull: true },
        isLengthEstimated: { type: "boolean", allowNull: false, defaultsTo: false },
    },

    /** Indicates which model attributes have defined domains.
     */
    domainDefined: {
        purposeAchieved: true
    },

    /**
     * Calculates the checkOutTime and then visitLength setting a flag if the visitLength is greater than 8 when a Visit record is passed through the populateOne helper.
     * @modifies Database contents.
     * 
     * Note global: PopulateOne checks if a function named afterPopulateOne is defined in the model of any record. The definition is model specific and runs when the record is passed through the populateOne helper.
     */
    afterPopulateOne: function(visit) {
        let checkOutTime = visit.checkOutTime;
        if (checkOutTime === null) {
            checkOutTime = new Date(sails.helpers.getCurrentTime());
        }
        visit.visitLength = ((new Date(checkOutTime)).getTime()) - ((new Date(visit.checkInTime)).getTime());
        visit.visitLength = sails.helpers.convertToHours(visit.visitLength);
        if (visit.visitLength > 8) {
            visit.isLengthEstimated = true;
        }
        sails.log.debug("afterPopulateOne " + JSON.stringify(visit));
        return visit;
    },

    afterEncodeAssociations: async function(visit) {
        if (visit.purposeAchieved) {
            visit.checkOutTime = new Date(sails.helpers.getCurrentTime());
            if (!visit.visitLength) {
                let current = await Visit.find({ where: { name: visit.name }, limit: 1, sort: "checkInTime DESC" });
                visit.checkInTime = current[0].checkInTime;
                visit.visitLength = ((new Date(visit.checkOutTime)).getTime()) - ((new Date(visit.checkInTime)).getTime());
                visit.visitLength = sails.helpers.convertToHours(visit.visitLength);
            } else {
                visit.isLengthEstimated = true;
            }
        }
        return visit;
    },

    testRecords: [],

    /**
     * Populates the database with test data for use in development environments.
     * @modifies Database contents.
     * 
     * Note convention: sample data is ALL CAPS, using .net rather than .edu domain
     */
    createTestData: async function() {
        const oneDay = 24 * 60 * 60 * 1000;

        // First student has NO associated visits.

        // All remaining students have old closed visits.
        for (let iStudent = 1; iStudent < Student.testRecords.length; iStudent++) {
            for (let iVisit = 1; iVisit <= iStudent; iVisit++) {
                let record = {
                    name: Student.testRecords[iStudent].id,
                    checkInTime: new Date(`2018-${iVisit}-${iVisit} ${iVisit}:${iVisit}:${iVisit}`),
                    checkOutTime: new Date(`2018-${iVisit}-${iVisit} ${2 * iVisit}:${iVisit}:${iVisit}`),
                    visitLength: iVisit,
                    visitPurpose: `OLD CLOSED VISIT`,
                    purposeAchieved: Visit.attributes.purposeAchieved.validations.isIn[iVisit % Visit.attributes.purposeAchieved.validations.isIn.length],
                    tutorCourses: `TUTOR COURSES ${iVisit}`,
                    comment: `COMMENT ${iVisit}`,
                    isLengthEstimated: false
                };
                console.log(record.checkInTime + " " + record.checkOutTime);
                this.testRecords.push(await Visit.create(record).fetch());
            }

            // Second student has closed visits only.
            if (iStudent === 1) continue;

            // Third student has a visit opened yesterday, and
            // all others have a visit opened today.
            let record = {
                name: Student.testRecords[iStudent].id,
                checkInTime: new Date(sails.helpers.getCurrentTime() - (iStudent === 2 ? oneDay : 0)),
                visitPurpose: "VISIT OPENED " + (iStudent === 2 ? "YESTERDAY" : "TODAY")
            };
            this.testRecords.push(await Visit.create(record).fetch());
        }
    }

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
