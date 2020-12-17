describe("Dynamic routing for students", () => {
    it("Uses student status to display the correct page", () => {
        const username = `studentRouting${(new Date()).valueOf()}`;

        // Student's first log in ...
        cy.loginStudent(username);

        // ... should require student profile update.
        cy.updateStudentProfile(false);

        // Then, student should be directed to check in.
        cy.checkInStudent();

        // Next login, they should be directed to check out.
        cy.loginStudent(username, false);
        cy.checkOutStudent();

        // And next login, to check in again.
        cy.loginStudent(username, false);
        cy.checkInStudent();
    });
});
