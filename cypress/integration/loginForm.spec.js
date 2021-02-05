describe("The login form", () => {
    it("should ensure the user is logged out", () => {
        const username = `loginForm${(new Date()).valueOf()}`;

        cy.loginStaff(username);
        cy.get("[data-cy=navbar]").should("exist");
        cy.visit("/login");
        cy.get("[data-cy=navbar]").should("not.exist");
    });
});
