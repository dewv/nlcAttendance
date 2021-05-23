describe("The visits index page", () => {
    it("should display student visits with fetch-on-scroll", () => {
        const username = `visitIndexPage${(new Date()).valueOf()}`;
        cy.loginStaff(username);

        cy.get("tbody > tr").should("have.length", 10);
        cy.get("#infinite-scroller").scrollTo("bottom");
        cy.get("tbody > tr").should("have.length", 20);
        cy.get("#infinite-scroller").scrollTo("bottom");
        cy.get("tbody > tr").should("have.length", 30);
    });

    it("should allow a CSV download of all student visit data");
});

