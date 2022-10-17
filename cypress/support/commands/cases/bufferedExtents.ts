/// <reference types="cypress" />

declare global {
  interface Chainable {
    b0: typeof b0;
    b1: typeof b1;
    b2: typeof b2;
  }
}

export const b0 = () => {
  it("should have length of 0", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .its("bufferedExtents")
      .its("data")
      .its("features")
      .should("have.length", 0);
  });
};

export const b1 = () => {
  it("should have a length within 1 and 4", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .its("bufferedExtents")
      .its("data")
      .its("features")
      .should("have.length.within", 1, 4);
  });
};

export const b2 = () => {
  it("should have a length of 5", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .its("bufferedExtents")
      .its("data")
      .its("features")
      .should("have.length", 5);
  });
};
