describe("The check out form", () => {
    it("should accept valid inputs", () => {
        const username = `checkOutForm${(new Date()).valueOf()}`;

        cy.loginStudent(username);
        cy.updateStudentProfile(false);
        cy.checkInStudent();
        cy.loginStudent(username);
        // Normally, visit length is computed, not entered by user.
        cy.get("[name=length]").should("not.exist");
        cy.checkOutStudent();
    });

    it("should correctly show/hide inputs for tutoring details", () => {
        const username = `hideTutorDetails${(new Date()).valueOf()}`;

        cy.loginStudent(username);
        cy.updateStudentProfile(false);
        cy.checkInStudent();
        cy.loginStudent(username);
        cy.url().should("match", /\/visit\/.*\/edit$/);

        // Inputs for tutoring details should be hidden when page loads.
        cy.get("[name=tutorCourses]").should("not.be.visible");
        cy.get("[name=tutorInstructors]").should("not.be.visible");

        // Inputs for tutoring details should be revealed when student says they used a tutor.
        cy.get("[name=usedTutor]").select("Yes");
        cy.get("[name=tutorCourses]").should("be.visible");
        cy.get("[name=tutorInstructors]").should("be.visible");

        // Inputs for tutoring details should be re-hidden when student says they used no tutor.
        cy.get("[name=usedTutor]").select("No");
        cy.get("[name=tutorCourses]").should("not.be.visible");
        cy.get("[name=tutorInstructors]").should("not.be.visible");
        // TODO test that selecting "No" also clears contents of courses and tutors fields; otherwise they will be written to database on submit.
    });

    it("should have student estimate length of visits opened more than 8 hours ago", () => {
        // Server-side test support code will back date check-in using following purpose:
        const purpose = "To test visit length estimation";

        const username = `estimateLength${(new Date()).valueOf()}`;

        cy.loginStudent(username);
        cy.updateStudentProfile(false);
        cy.checkInStudent(purpose);
        cy.loginStudent(username);
        cy.url().should("match", /\/visit\/.*\/edit$/);

        cy.get("[name=length]").should("exist");
        cy.get("[name=length]").select("0.75");
        cy.checkOutStudent();
    });
});
