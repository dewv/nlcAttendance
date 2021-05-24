describe("The student profile form", () => {
    it("should require student to enter their academic rank", () => {
        // Generate unique username.
        const username = `academicRank${new Date().valueOf()}`;

        // Login as student. NB this fills in required fields.
        cy.loginStudent(username);

        // This first time login takes us to student profile update; need a closure to use the url.
        cy.url().then(($profileUrl) => {
            // Fill in all required fields ...
            cy.get("select#residentialStatus").select("Commuter");
            // ... except the one under test: cy.get("select#academicRank").select("Freshman");

            // Submit the form.
            cy.get("[data-cy=submit]").click();

            // Since required data was not supplied, should still be on same page.
            cy.url().should("equal", $profileUrl);
        });
    });

    it("should require student to enter their residential status", () => {
        // Generate unique username.
        const username = `residentialStatus${new Date().valueOf()}`;

        // Login as student.
        cy.loginStudent(username);

        // This first time login takes us to student profile update; need a closure to use the url.
        cy.url().then(($profileUrl) => {
            // Fill in all required fields ...
            cy.get("select#academicRank").select("Freshman");
            // ... except the one under test: cy.get("select#residentialStatus").select("Commuter");

            // Submit the form.
            cy.get("[data-cy=submit]").click();

            // Since required data was not supplied, should still be on same page.
            cy.url().should("equal", $profileUrl);
        });
    });
});
