describe("Data management for Sports", () => {
    it("should allow staff to add a new Sport", () => {
        cy.loginStaff("addASport");

        cy.get("[data-cy=sports-link]").click();
        cy.get("[data-cy=new-sport-link]").click();

        cy.url().should("match", /\/sport\/new$/);
        cy.get("[name=name]").type("A new sport");
        cy.get("[data-cy=submit]").click();

        cy.url().should("match", /\/sport$/);
    });

    it("should allow staff to change a Sport's `discontinued` flag.");
});
