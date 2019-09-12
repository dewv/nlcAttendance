/**
 * Visit.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    schema: false,

    attributes: {
        studentId: { model: "Student" },
        checkInTime: { type: "ref", columnType: "datetime", autoCreatedAt: true },
        checkOutTime: { type: "ref", columnType: "datetime" },
        length: { type: "number", required: false, allowNull: true },
        purpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", allowNull: true, isIn: ["Yes", "No", "Not sure"] },
        usedTutor: { type: "string", defaultsTo: "No" },
        tutorCourses: { type: "string", required: false, allowNull: true },
        comment: { type: "string", allowNull: true },
        isLengthEstimated: { type: "boolean", allowNull: false, defaultsTo: false },
    },

    // Define the model's proper query for displaying it's data.
    recordListQuery: 'SELECT visit.id, checkInTime, checkOutTime, length, purpose, purposeAchieved, usedTutor, tutorCourses, comment, isLengthEstimated, firstName, lastName FROM visit, student WHERE visit.studentId = student.id ORDER BY visit.id DESC;',

    /** Indicates which model attributes have defined domains.
     */
    domainDefined: {
        purposeAchieved: true
    },

    /**
     * Calculates the checkOutTime and then length setting a flag if the length is greater than 8 when a Visit record is passed through the populateOne helper.
     * @modifies Database contents.
     * 
     * Note global: PopulateOne checks if a function named afterPopulateOne is defined in the model of any record. The definition is model specific and runs when the record is passed through the populateOne helper.
     */
    afterPopulateOne: function(visit) {
        if (visit.checkOutTime === null) visit.checkOutTime = new Date(sails.helpers.getCurrentTime());
        visit.length = ((new Date(visit.checkOutTime)).getTime()) - ((new Date(visit.checkInTime)).getTime());
        visit.length = sails.helpers.convertToHours(visit.length);
        if (visit.length > 8) visit.isLengthEstimated = true;
        return visit;
    },

    /**
     * Takes data passed from encodeAssociations, modifies it as needed and returns that data back to the encodeAssociations helper.
     * @modifies Database contents.
     * 
     * Note global: EncodeAssociations checks if a function named afterEncodeAssociations is defined in the model of any record. The definition is model specific and runs when the record is passed through the encodeAssociations helper.
     */
    afterEncodeAssociations: async function(visit) {
        if (visit.purposeAchieved) {
            visit.checkOutTime = new Date(sails.helpers.getCurrentTime());
            if (!visit.length) {
                let current = await Visit.find({ where: { studentId: visit.studentId}, limit: 1, sort: "checkInTime DESC" });
                visit.checkInTime = current[0].checkInTime;
                visit.length = ((new Date(visit.checkOutTime)).getTime()) - ((new Date(visit.checkInTime)).getTime());
                visit.length = sails.helpers.convertToHours(visit.length);
            }
            else {
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
        const oneHour = 60 * 60 * 1000;

        // First student has NO associated visits.

        // All remaining students have old closed visits.
        for (let iStudent = 1; iStudent < Student.testRecords.length; iStudent++) {
            for (let iVisit = 1; iVisit <= 3; iVisit++) {
                if(iStudent === 5) continue;
                let record = {
                    studentId: Student.testRecords[iStudent].id,
                    checkInTime: new Date(`2018-${iVisit}-${iVisit} ${iVisit}:${iVisit}:${iVisit}`),
                    checkOutTime: new Date(`2018-${iVisit}-${iVisit} ${2 * iVisit}:${iVisit}:${iVisit}`),
                    length: iVisit,
                    purpose: `OLD CLOSED VISIT`,
                    purposeAchieved: Visit.attributes.purposeAchieved.validations.isIn[iVisit % Visit.attributes.purposeAchieved.validations.isIn.length],
                    tutorCourses: `TUTOR COURSES ${iVisit}`,
                    comment: `COMMENT ${iVisit}`,
                    isLengthEstimated: false
                };
                console.log(record.checkInTime + " " + record.checkOutTime);
                this.testRecords.push(await Visit.create(record).fetch());
            }

        }
        
        // Third student has a visit opened yesterday, and
        // all others have a visit opened today.
        for (let iStudent = 2; iStudent < Student.testRecords.length; iStudent++) {
            
            let record;
            let yesterday = {
                studentId: Student.testRecords[iStudent].id,
                checkInTime: new Date(sails.helpers.getCurrentTime() - oneDay),
                purpose: "VISIT OPENED YESTERDAY"
            };
            let today = {
                studentId: Student.testRecords[iStudent].id,
                checkInTime: new Date(sails.helpers.getCurrentTime() - (oneHour * (.5 * iStudent))),
                purpose: "VISIT OPENED TODAY"
            };
            if (iStudent === 2 || iStudent === 7) {
                record = yesterday;
            } else record = today;
            
            if (iStudent === 5 || iStudent === 6) continue;
            
            this.testRecords.push(await Visit.create(record).fetch());
        }
    }

};


/**
 * A student visit record.
 * @typedef {Record} VisitRecord
 * @property {Student} studentId - The associated student record.
 * @property {ref} checkInTime - A reference to createdAt formated in UTC.
 * @property {ref} checkOutTime - A timestamp in UTC used to calculate length, defaults to '0000-00-00 00:00:00'.
 * @property {number} length - The number of hours, to the nearest quarter hour, the student was at the NLC. The difference between the checkOutTime and CheckInTime.
 * @property {string} purpose - The reason the student visited the NLC.
 * @property {string} purposeAchieved - Did the student accomplish their goal this visit.
 * @property {string} tutorCourses - The course of which the student used a tutor.
 * @property {string} comment - Any comments the student may have about their visit.
 * @property {boolean} isLengthEstimated=false - Indicates if it is mandatory for the student to estimate the length of their last visit when the value is true. 
 */
