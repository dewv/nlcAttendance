describe("The student profile form", () => {
    it.skip("should require student to enter their academic rank", () => {
        // Generate unique username.
        const username = `studentProfileAcademicRank${(new Date()).valueOf()}`;

        // Login as student. NB this fills in required fields.
        cy.loginStudent(username);

        // This first time login takes us to student profile update; store the url.
        let profileUrl = cy.url();

        // "Clear" the required field under test. 
        cy.get("select#academicRank").select("Choose one ...");

        // Submit the form. 
        cy.get("[data-cy=submit]").click();

        // Since required data was not supplied, should still be on same page.
        cy.url().should("equal", profileUrl);
    });

    it("should require student to enter their residential status", () => {
        // Generate unique username.
        const username = `XresidentialStatus${(new Date()).valueOf()}`;
        // Login as student. NB this fills in required fields.
        cy.loginStudent(username);

        // This first time login takes us to student profile update; store the url.
        let profileUrl = cy.url();

        // "Clear" the required field under test. 
        cy.get("select#residentialStatus").select("Commuter");
        cy.get("select#academicRank").select("Senior");

        // Submit the form. 
        cy.get("[data-cy=submit]").click();

        // Since required data was not supplied, should still be on same page.
        cy.url().should("equal", profileUrl);
   });
});
