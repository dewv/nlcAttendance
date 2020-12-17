describe("The check in form", () => {
    it("should accept valid inputs", () => {
        const username = `checkInForm${(new Date()).valueOf()}`;

        cy.loginStudent(username);
        cy.updateStudentProfile(false);
        cy.checkInStudent();
    });

    it("should require student to enter a purpose", () => {
        const username = `checkInFormPurpose${(new Date()).valueOf()}`;

        cy.loginStudent(username);
        cy.updateStudentProfile(false);

        // Submit without entering purpose ...
        cy.get("[data-cy=submit]").click();
        // ... should keep you on the same page.
        cy.url().should("match", /\/visit\/new$/);
    });
});
