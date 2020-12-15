describe("Dynamic routing for students", () => {
    it("Uses student status to display the correct page", () => {
        function _submitLoginForm(username, password) {
            cy.get('[name="username"]').type(username);
            cy.get('[name="password"]').type(password);
            cy.get('[data-cy=submit]').click();
        }

        // Guarantee first-time student user
        const username = `u${(new Date()).valueOf()}`;
        const password = "student";

        // Student's first log in ...
        cy.visit("/");
        _submitLoginForm(username, password);

        // ... sould require student profile update.
        cy.url().should('match', /\/student\/.*\/edit$/);
        // TODO user can submit form doing nothing - no required entries!
        cy.get('[data-cy=submit]').click();

        // Then, sessions alternate between checking in ...
        cy.url().should('match', /\/visit\/new$/);
        const purpose = "Try to take over the world!";
        cy.get('[name="purpose"]').type(purpose);
        cy.get('[data-cy=submit]').click();
        cy.url().should('match', /\/logout$/);

        // ... checking out, ...
        _submitLoginForm(username, password);
        cy.url().should('match', /\/visit\/.*\/edit$/);
        cy.get('[name="purposeAchieved"]').select('Yes');
        cy.get('[name="usedTutor"]').select('No');
        cy.get('[data-cy=submit]').click();
        cy.url().should('match', /\/logout$/);

        // ... and back in again.
        _submitLoginForm(username, password);
        cy.url().should('match', /\/visit\/new$/);
    });
});
