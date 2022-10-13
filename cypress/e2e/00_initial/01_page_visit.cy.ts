/**
 * Test to visit the page
 */
describe("Visit Page Test", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");
  });
});
