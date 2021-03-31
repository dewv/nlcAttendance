describe("The student profile form", () => {
    it("should require student to enter their academic rank", () => {
        // generate unique username
        const username = `studentProfileAcademicStatus${(new Date()).valueOf()}`;

        // login as student
        cy.loginStudent(username);

        // this first time login takes us to student profile update; store the url
        let profileUrl = cy.url();

        // (get select element with id residentialStatus, choose "Undecided")
        cy.get('select#residentialStatus").select("Undecided");
       // (then need to fill in all other required fields except the one under test)

       // click the form submit button
       cy.get("[data-cy=submit]").click();

        // Since required data was not supplied, should still be on same page.
        cy.url().should("equal", profileUrl);
    });

    it("should require student to enter their residential status", () => {
        // this one should populate all required data except residential status, submit form, make sure url stays same
    });
});
