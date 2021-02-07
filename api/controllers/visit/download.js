module.exports = {
    friendlyName: "Download a .CSV list of Visit records",

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

        let records = await Visit.find().sort("checkInTime DESC").populate("student");
        let majors = await Major.find();
        let sports = await Sport.find();
        let staff = await Staff.find({ isSlpInstructor: true });

        let date = new Intl.DateTimeFormat("en-us", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "numeric", minute: "numeric", second: "numeric",
        });

        let download = "";

        for (let i = 0; i < records.length; i++) {
            let visit = records[i];

            download += `"${records.length - i}","${visit.student.username}","${visit.student.firstName}","${visit.student.lastName}","${date.format(visit.checkInTime)}","${visit.checkOutTime ? date.format(visit.checkOutTime) : ""}","${visit.length}","${visit.isLengthEstimated}","${visit.purpose}","${visit.purposeAchieved}","${visit.location}","${visit.comment}","${visit.student.academicRank}","${visit.student.residentialStatus}",`;

            let majorOne = majors.find(element => element.id === visit.student.majorOne);
            download += `"${majorOne ? majorOne.name : ""}",`;
            let majorTwo = majors.find(element => element.id === visit.student.majorTwo);
            download += `"${majorTwo ? majorTwo.name : ""}",`;
            let sportOne = sports.find(element => element.id === visit.student.sportOne);
            download += `"${sportOne ? sportOne.name : ""}",`;
            let sportTwo = sports.find(element => element.id === visit.student.sportTwo);
            download += `"${sportTwo ? sportTwo.name : ""}",`;
            let slpInstructor = staff.find(element => element.id === visit.student.slpInstructor);
            download += `"${slpInstructor ? slpInstructor.firstName + " " + slpInstructor.lastName : ""}",`;

            download += `"${visit.tutorCourses}","${visit.tutorInstructors}"\n`;
        }

        // Replace nulls with empty strings.
        download = download.replace(/\"null\"/g, "\"\"");

        let headings = `"#","Email","First Name","Last Name","Check In","Check Out","Visit Length","Check Out estimated?","Purpose of Visit","Purpose Achieved?","Location","Comments","Academic Year","Residential Status","Major 1","Major 2","Sport 1","Sport 2","SLP Instructor","Tutoring Course","Tutoring Instructor"`;

        return exits.success(response.set({ "Content-Type": "text/csv", "Content-Disposition": "filename=\"visits.csv\"" }).send(`${headings}\n${download}`));
    }
};
