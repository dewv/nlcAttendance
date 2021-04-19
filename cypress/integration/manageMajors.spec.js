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
    cy.loginStaff("DiscontinueAMajor");

    cy.get("[data-cy=majors-link]").click();
    let openBoxes = cy.get('.fa-squares-o')
    let openBoxesCount = openBoxes.length

    cy.url().should("match", /\/major\/new$/);
    let openBoxes = cy.get('.fa-square-0')
    let checkedBoxesCount = openBoxes.length
    cy.get("[name=name]").type("Discontinue major");
    openBoxes[0].click();
    cy.get('.fa-square-o').length.should.equal(openBoxCount - 1);
    cy.get("[data-cy=submit]").click();
    checkedBoxes[0].click();
    cy.get('.fa-squares-o').length.should.equal(checkedBoxesCount + 1);
    cy.url().should("match", /\/major$/);

});
