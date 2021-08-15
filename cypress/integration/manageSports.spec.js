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

    it("should allow staff to change a Sport's `discontinued` flag.", () => {
        // Log in as staff and navigate to sports page.
        cy.loginStaff("DiscontinueASport");
        cy.get("[data-cy=sports-link]").click();

        cy.get(".custom-check-box").first().within(() => {
            cy.get(".fa-square-o").click();
            cy.get(".fa-check-square-o").click();
        });
    });
});
