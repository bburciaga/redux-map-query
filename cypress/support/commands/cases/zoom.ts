/// <reference types="cypress" />

declare global {
  interface Chainable {
    z0: typeof z0;
    z1: typeof z1;
    zoomIn: typeof zoomIn;
    zoomOut: typeof zoomOut;
  }
}

export const zoomIn = () => {
  for (let i = 0; i < 5; i++) {
    cy.wait(250);
    cy.get(".leaflet-control-zoom-in").click();
    cy.wait(250);
  }
};

export const zoomOut = () => {
  for (let i = 0; i < 5; i++) {
    cy.wait(250);
    cy.get(".leaflet-control-zoom-out").click();
    cy.wait(250);
  }
};

export const z0 = () => {
  it("Can check if user is outside of render zoom levels", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .its("userSettings")
      .its("zoom_level")
      .should("be.within", 1, 9);
  });
};

export const z1 = () => {
  it("Can check if user is within zoom levels", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .its("userSettings")
      .its("zoom_level")
      .should("be.within", 10, 30);
  });
};
