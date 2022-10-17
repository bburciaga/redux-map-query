/// <reference types="cypress" />

import { b0, b1, b2 } from "./cases/bufferedExtents";
import { z0, z1 } from "./cases/zoom";

declare global {
  namespace Cypress {
    interface Chainable {
      bufferedExtentsTestCase: typeof bufferedExtentsTestCase;
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
  let key: string = "";

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
    if (zCase) z1();
    else z0();

    switch (bCase) {
      case 0:
        b0();
        break;
      case 1:
        b1();
        break;
      case 2:
        b2();
        break;
    }

    it("Can move the bounds", () => {
      // for (let i: number = 0; i < m; i++) {
      //   cy.get("#main-map").type("{shift}" + { key });
      //   cy.wait(250);
      // }
    });
  });
};
