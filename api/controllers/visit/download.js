module.exports = {
    friendlyName: "Download a list of Visit records",

    description: "Controller action for GETting a download of Visit model records.",

    inputs: {
    },

    exits: {
        success: {
            description: "Download all visit records."
        },
        unauthorized: {
            description: "The user is not staff.",
            responseType: "forbidden"
        }
    },

    fn: async function (inputs, exits) {
        let request = this.req;
        let response = this.res;
        if (request.session.role !== "staff") throw "unauthorized";

        let records = await Visit.find().sort("id DESC");
        let options = {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "numeric", minute: "numeric", second: "numeric",
        };

        let download = "";
        for (let visit of records) {
            let student = await Student.findOne({ id: visit.student }).populate("majorOne").populate("majorTwo").populate("sportOne").populate("sportTwo").populate("slpInstructor");

            download += `"${visit.id}","${student.firstName}","${student.lastName}","${new Intl.DateTimeFormat("en-US", options).format(visit.checkInTime)}","${visit.checkOutTime ? new Intl.DateTimeFormat("en-US", options).format(visit.checkOutTime) : ""}","${visit.length}","${visit.isLengthEstimated}","${visit.purpose}","${visit.purposeAchieved}","${visit.location}","${visit.comment}","${student.academicRank}","${student.residentialStatus}","${student.majorOne.name}",`;

            download += `"${student.majorTwo ? student.majorTwo.name : ""}",`;
            download += `"${student.sportOne ? student.sportOne.name : ""}",`;
            download += `"${student.sportTwo ? student.sportTwo.name : ""}",`;
            download += `"${student.slpInstructor ? student.slpInstructor.firstName + " " + student.slpInstructor.lastName : ""}",`;

            download += `"${visit.tutorCourses}","${visit.tutorInstructors}"\n`;
        }

        download = download.replace(/\"null\"/g, "\"\"");

        let headings = `"#","First Name","Last Name","Check In","Check Out","Visit Length","Check Out estimated?","Purpose of Visit","Purpose Achieved?","Location","Comments","Academic Year","Residential Status","Major 1","Major 2","Sport 1","Sport 2","SLP Instructor","Tutoring Course","Tutoring Instructor"`;

        return exits.success(response.set({ "Content-Type": "text/csv", "Content-Disposition": "filename=\"visits.csv\"" }).send(`${headings}\n${download}`));
    }
};
