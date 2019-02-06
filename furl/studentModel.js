const Model = require("./furlsails/Model");

class StudentModel extends Model {
    constructor() {
        super();
    }

    /** override */
    get sails() {
        return Student;
    }

    /** override */
    async getAssociationDomains() {
        return {
            fallSport: await Sport.find(),
            springSport: await Sport.find(),
            major: await Major.find(),
        };
    }

    /** override */
    async encodeAssociations(record) {
        if (record.fallSport) {
            let fallSport = await Sport.findOne({ name: record.fallSport });
            record.fallSport = fallSport ? fallSport.id : null;
        }

        if (record.springSport) {
            let springSport = await Sport.findOne({ name: record.springSport });
            record.springSport = springSport ? springSport.id : null;
        }
        
        if (record.major) {
            let major = await Major.findOne({ name: record.name });
            record.major = major ? Major.id : null;
        }
    }

    /** override */
    async populateOne(id) {
        return await Student.findOne({ id }).populate("fallSport").populate("springSport").populate("majors");
    }
}

module.exports = new StudentModel();

/* global Student, Sport, Major,  */
