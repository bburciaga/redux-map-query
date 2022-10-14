/**
 * Test to visit the page
 *
 * npx cypress run --record --key 29461e4b-901d-4510-a3db-61f9bb5f4edb
 */
describe("Visit Page Test", () => {
  it("Goes to webpage", () => {
    cy.visit("http://localhost:3000");
    cy.wait(500);
  });
});
