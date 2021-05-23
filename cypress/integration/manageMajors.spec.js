describe("Data management for Majors", () => {
    it("should allow staff to add a new Major", () => {
        cy.loginStaff("addAMajor");

        cy.get("[data-cy=majors-link]").click();
        cy.get("[data-cy=new-major-link]").click();

        cy.url().should("match", /\/major\/new$/);
        cy.get("[name=name]").type("A new major");
        cy.get("[data-cy=submit]").click();

        cy.url().should("match", /\/major$/);
    });

    it("should allow staff to change a Major's `discontinued` flag.", () => {
        // Log in as staff and navigate to majors page.
        cy.loginStaff("DiscontinueAMajor");
        cy.get("[data-cy=majors-link]").click();

        // First major is not discontinued; click it.
        cy.get("[data-cy=No1]").click();
        // It should now be discontinued.
        cy.get("[data-cy=No1]").should("not.exist");
        // Click it again.
        cy.get("[data-cy=Yes1]").click();
        // Again it should not be discontinued.
        cy.get("[data-cy=Yes1]").should("not.exist");
    });
});
