/**
 * Represents a set of visit records. 
 * @module 
 * @implements Model
 * @borrows VisitRecord as VisitRecord
 */
module.exports = {
    attributes: {
        student: { model: "Student" },
        checkInTime: { type: "ref", columnType: "datetime", autoCreatedAt: true },
        checkOutTime: { type: "ref", columnType: "datetime" },
        location: { type: "string" },
        length: { type: "number", required: false, allowNull: true },
        purpose: { type: "string", required: true, allowNull: false },
        purposeAchieved: { type: "string", allowNull: true, isIn: ["Yes", "No", "Not sure"] },
        usedTutor: { type: "string" },
        tutorCourses: { type: "string", required: false, allowNull: true },
        tutorInstructors: { type: "string", required: false, allowNull: true },
        comment: { type: "string", allowNull: true },
        isLengthEstimated: { type: "boolean", required: false, allowNull: true },
    },

    getDefaults: function () {
        return {
            student: null,
            checkInTime: null,
            checkOutTime: null,
            location: "",
            length: null,
            purpose: "",
            purposeAchieved: { name: "Choose one ..." },
            usedTutor: "",
            tutorCourses: "",
            tutorInstructors: "",
            comment: ""
        };
    },

    // Define the model's one to many association.
    recordToAssociate: "student",

    /** 
     * Indicates which model attributes have defined domains.
     */
    domainDefined: {
        purposeAchieved: true
    },

    /** 
     * Indicates which model attributes are required when a closes a visit.
     */
    inputRequired: {
        purposeAchieved: true
    },

    testRecords: [],

    /**
     * Populates the database with test data for use in development environments.
     * @modifies Database contents.
     * 
     * Note convention: sample data is ALL CAPS.
     */
    createTestData: async function () {
        const oneDay = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;

        // First student has NO associated visits.

        // All remaining students have old closed visits.
        for (let iStudent = 1; iStudent < Student.testRecords.length; iStudent++) {
            for (let iVisit = 1; iVisit <= 3; iVisit++) {
                if (iStudent === 5) continue;
                let record = {
                    student: Student.testRecords[iStudent].id,
                    checkInTime: new Date(`2018-${iVisit}-${iVisit} ${iVisit}:${iVisit}`),
                    checkOutTime: new Date(`2018-${iVisit}-${iVisit} ${2 * iVisit}:${iVisit}`),
                    location: `TEST LOCATION`,
                    length: iVisit,
                    purpose: `OLD CLOSED VISIT`,
                    purposeAchieved: Visit.attributes.purposeAchieved.validations.isIn[iVisit % Visit.attributes.purposeAchieved.validations.isIn.length],
                    tutorCourses: `tutorCourses ${iVisit}`,
                    tutorInstructors: `tutorInstructors ${iVisit}`,
                    comment: `COMMENT ${iVisit}`,
                    isLengthEstimated: false
                };
                this.testRecords.push(await Visit.create(record).fetch());
            }
        }

        // Third student has a visit opened yesterday, and all others have a visit opened today.
        for (let iStudent = 2; iStudent < Student.testRecords.length; iStudent++) {
            let record;
            let yesterday = {
                student: Student.testRecords[iStudent].id,
                checkInTime: new Date(sails.helpers.getCurrentTime() - oneDay),
                location: `TEST LOCATION`,
                purpose: "VISIT OPENED YESTERDAY"
            };
            let today = {
                student: Student.testRecords[iStudent].id,
                checkInTime: new Date(sails.helpers.getCurrentTime() - (oneHour * (.5 * iStudent))),
                location: `TEST LOCATION`,
                purpose: "VISIT OPENED TODAY"
            };
            if (iStudent === 2 || iStudent === 7) {
                record = yesterday;
            } else {
                record = today;
            }

            if (iStudent === 5 || iStudent === 6) continue;

            this.testRecords.push(await Visit.create(record).fetch());
        }
    }
};

/**
 * A student visit record.
 * @typedef {Record} VisitRecord
 * @property {Student} student - The associated student record.
 * @property {ref} checkInTime - A reference to createdAt formated in UTC.
 * @property {ref} checkOutTime - A timestamp in UTC used to calculate length, defaults to '0000-00-00 00:00:00'.
 * @property {string} location - An identifier for the browser that the student used to check in.
 * @property {number} length - The number of hours, to the nearest quarter hour, the student was at the NLC. The difference between the checkOutTime and CheckInTime.
 * @property {string} purpose - The reason the student visited the NLC.
 * @property {string} purposeAchieved - Did the student accomplish their goal this visit.
 * @property {string} tutorCourses - The course of which the student used a tutor.
 * @property {string} comment - Any comments the student may have about their visit.
 * @property {boolean} isLengthEstimated - Indicates if it is mandatory for the student to estimate the length of their last visit when the value is true.
 */
