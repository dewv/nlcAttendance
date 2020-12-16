describe("Data management for Majors", () => {
    it("should allow staff to add a new Major", () => {
        function _submitLoginForm(username, password) {
            cy.get("[name=\"username\"]").type(username);
            cy.get("[name=\"password\"]").type(password);
            cy.get("[data-cy=submit]").click();
        }

        const username = "staff";
        const password = "staff";

        cy.visit("/");
        _submitLoginForm(username, password);

        cy.get("[data-cy=majors-link]").click();
        cy.get("[data-cy=new-major-link]").click();

        cy.url().should("match", /\/major\/new$/);
        cy.get("[name=\"name\"]").type("A new major");
        cy.get("[data-cy=submit]").click();

        cy.url().should("match", /\/major$/);
   });
});
