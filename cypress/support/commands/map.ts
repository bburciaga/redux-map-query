/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      bufferedExtentsTestCase: typeof bufferedExtentsTestCase;
      zoomIn: typeof zoomIn;
    }
  }
}

// b0   extents = 0
// b1   1 <= extents < 5
// b3   extents = 5
// m0   move north
// m1   move south
// m2   move east
// m3   move west
// z0   false
// z1   true
export const bufferedExtentsTestCase = (
  mCase: number,
  bCase: number,
  zCase: number
) => {
  let boundsToTest: string = "";
  let key: string = "";

  switch (bCase) {
    case 0:
      boundsToTest = "extents = 0";
      break;
    case 1:
      boundsToTest = "1 <= extents <= 4";
      break;
    case 3:
      boundsToTest = "extents = 5";
      break;
  }

  switch (mCase) {
    case 1:
      key = "{upArrow}";
      break;
    case 2:
      key = "{downArrow}";
      break;
    case 3:
      key = "{rightArrow}";
      break;
    case 4:
      key = "{leftArrow}";
      break;
  }

  describe("Move map with keypress", () => {
    it("should " + !zCase && "not" + " be within zoom bounds", () => {
      // add userSettings map zoom level
    });

    it("should have " + boundsToTest, () => {
      if (bCase === 1) {
        cy.window()
          .its("store")
          .invoke("getState")
          .its("bufferedExtents")
          .its("data")
          .its("features")
          .should("have.length.within", 1, 4);
      } else {
        cy.window()
          .its("store")
          .invoke("getState")
          .its("bufferedExtents")
          .its("data")
          .its("features")
          .should("have.length", bCase === 0 ? 0 : 5);
      }
    });

    it("Can move the bounds", () => {
      // for (let i: number = 0; i < m; i++) {
      //   cy.get("#main-map").type("{shift}" + { key });
      //   cy.wait(250);
      // }
    });
  });
};

export const zoomIn = () => {
  for (let i = 0; i < 5; i++) {
    cy.wait(250);
    cy.get(".leaflet-control-zoom-in").click();
    cy.wait(250);
  }
};
