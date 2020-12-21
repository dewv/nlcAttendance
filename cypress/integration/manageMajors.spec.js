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

    it("should allow staff to change a Major's `discontinued` flag."); // TODO
});
