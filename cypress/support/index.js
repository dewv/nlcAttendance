// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
require("./commands");

Cypress.Commands.add("loginUnathorized", (username, navigate) => {
    if (navigate !== false) cy.visit("/login");
    cy.get("[name=username]").type(username);
    cy.get("[name=password]").type("neither");
    cy.get("[data-cy=submit]").click();
});

Cypress.Commands.add("loginStaff", (username, navigate) => {
    if (navigate !== false) cy.visit("/login");
    cy.get("[name=username]").type(username);
    cy.get("[name=password]").type("staff");
    cy.get("[data-cy=submit]").click();
});

Cypress.Commands.add("loginNoLdap", (username, navigate) => {
    if (navigate !== false) cy.visit("/login");
    cy.get("[name=username]").type(username);
    cy.get("[name=password]").type("noldap");
    cy.get("[data-cy=submit]").click();
});

Cypress.Commands.add("loginStudent", (username, navigate) => {
    if (navigate !== false) cy.visit("/login");
    cy.get("[name=username]").type(username);
    cy.get("[name=password]").type("student");
    cy.get("[data-cy=submit]").click();
});

Cypress.Commands.add("updateStudentProfile", (navigate, studentId) => {
    if (navigate !== false) {
        const url = `/student/${studentId}/edit`;
        cy.visit(url);
        cy.url().should("contain", url);
    } else {
        cy.url().should("match", /\/student\/.*\/edit$/);
    }

    cy.get("select#academicRank").select("Freshman");
    cy.get("select#residentialStatus").select("Commuter");
    cy.get("[data-cy=submit]").click();
});

Cypress.Commands.add("checkInStudent", (purpose) => {
    purpose = purpose || "Try to take over the world!";
    cy.url().should("match", /\/visit\/new$/);

    cy.get("[name=purpose]").type(purpose);
    cy.get("[data-cy=submit]").click();
    // (Check in or out automatically logs them out.)
    cy.url().should("match", /\/logout$/);
});

Cypress.Commands.add("checkOutStudent", () => {
    cy.url().should("match", /\/visit\/.*\/edit$/);
    cy.get("[name=purposeAchieved]").select("Yes");
    cy.get("[name=usedTutor]").select("No");
    cy.get("[name=comment]").type("Sarcastic");
    cy.get("[data-cy=submit]").click();
    // (Check in or out automatically logs them out.)
    cy.url().should("match", /\/logout$/);
});
