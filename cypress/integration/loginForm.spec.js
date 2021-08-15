describe("The login form", () => {
    it("should ensure the user is logged out before authenticating", () => {
        const username = `loginForm${(new Date()).valueOf()}`;

        cy.loginStaff(username);
        cy.get("[data-cy=navbar]").should("exist");
        cy.visit("/login");
        cy.get("[data-cy=navbar]").should("not.exist");
    });

    it("should show appropriate results when students authenticate", () => {
        const authenticate = `loginForm${(new Date()).valueOf()}`;

        cy.loginStudent(authenticate);
        cy.get("[data-cy=navbar]").should("exist");
        cy.visit("/login");
        cy.get("[data-cy=navbar]").should("not.exist");
    });

    it("should show appropriate results when staff authenticate", () => {
        const authenticate = `loginForm${(new Date()).valueOf()}`;

        cy.loginStaff(authenticate);
        cy.get("[data-cy=navbar]").should("exist");
        cy.visit("/login");
        cy.get("[data-cy=navbar]").should("not.exist");
    });

    it("should refuse access when unauthorized users authenticate", () => {
        const authenticate = `loginForm${(new Date()).valueOf()}`;
        cy.loginUnathorized(authenticate);
        cy.get(".alert-danger").contains(/authorized/);
    });
    it("should display an appropriate error when authentication services are not available", () => {
        const authenticate = `loginForm${(new Date()).valueOf()}`;
        cy.loginNoLdap(authenticate);
        cy.get(".alert-danger").contains(/connect/);
    });
});

