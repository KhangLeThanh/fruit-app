describe("Inventory App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("adds a new item", () => {
    cy.get("[data-testId='addButton']").click();

    // Fill form
    cy.get("input#name").type("Cypress Item");

    // Submit
    cy.get("[data-testId='submitButton']").click();

    // Verify it's added
    cy.contains("Cypress Item").should("exist");
  });

  it("edits an item", () => {
    // Find item and click Edit
    cy.contains("Cypress Item")
      .parents("li")
      .find("[data-testId='editButton']")
      .click();

    // Update name
    cy.get("input#name").clear().type("Cypress Item Updated");

    // Submit
    cy.get("[data-testId='submitButton']").click();

    // Verify update
    cy.contains("Cypress Item Updated").should("exist");
  });

  it("removes an item", () => {
    // Find item and click Remove
    cy.contains("Cypress Item Updated")
      .parents("li")
      .find("[data-testId='removeButton']")
      .click();

    // Confirm dialog (assumes ConfirmationDialog has buttons you can select)
    cy.get("[data-testId='modal']").contains("Delete").click();

    // Verify deletion
    cy.contains("Cypress Item Updated").should("not.exist");
  });
  it("goes back to the inventory list", () => {
    // Visit the edit or add form
    cy.visit("/form");

    // Click back
    cy.get("[data-testId='backButton']").click();

    // Assert we're back on the inventory list
    cy.url().should("include", "/");
    cy.contains("Inventory").should("exist");
  });
});
