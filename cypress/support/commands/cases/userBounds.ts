/// <reference types="cypress" />

declare global {
  interface Chainable {
    getUserBounds: typeof getUserBounds;
  }
}

export const getUserBounds = () => {
  let userBounds: any = null;

  // it("should be able to get user bounds feature", () => {
  //   cy.window()
  //     .its("store")
  //     .invoke("getState")
  //     .its("userSettings")
  //     .then((val: any) => {
  //       userBounds = val;
  //     });
  // });

  return userBounds;
}