describe("The visits index page", () => {
    it("should display a list of all student visits", () => {
        const username = `visitIndexPage${(new Date()).valueOf()}`;
        cy.getloginStaff(username);

        // maybe just scroll to bottom of table and test there are 30 rows
        cy.get("tr").should("have.length", 10);
        cy.get(".sidebar").scrollTo("bottom");
        cy.get("tr").should("have.length", 30);




    });

    it("should allow a CSV download of all student visit data");
});

