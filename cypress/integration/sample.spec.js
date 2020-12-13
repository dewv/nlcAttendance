describe("My First Test", () => {
    it("Gets, types and asserts", () => {
        cy.visit("/");
        // Get an input, type into it and verify that the value has been updated
        cy.get("[name=\"username\"]")
          .type("fake@email.com")
          .should("have.value", "fake@email.com");
    });
});
