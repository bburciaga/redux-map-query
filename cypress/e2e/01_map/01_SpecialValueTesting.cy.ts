import { bufferedExtentsTestCase } from "../../support/commands/map";

// describe("Zoom on Map", () => {
//   it("Can zoom in once", () => {
//     cy.get("#main-map").dblclick("center");
//   });
// });

// describe("Move on Map", () => {
//   it("Can be moved north", () => {
//     cy.get("#main-map").type("{shift+upArrow}");
//   });
// });

//  z1:   Zoom level < 9
//  z2:   Zoom level >= 9
//  B0:   extents = 0
//  B1:   1 <= extents < 5
//  B2:   extents = 5
//  M1:   Move out of bounds north
//  M2:   Move out of bounds south
//  M3:   Move out of bounds east
//  M4:   Move out of bounds west
describe("Special Value Testing", () => {
  // const bufferedExtents = useSelector(selectBufferedExtents);

  it("Goes to webpage", () => {
    // cy.log("=================", bufferedExtents);
    cy.visit("http://localhost:3000");
    cy.wait(500);
  });

  it("has expected state on load", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .its("bufferedExtents")
      .its("data")
      .its("features")
      .should("have.length", 0);
  });
  //  Case 1    z1    B0    Mn
  // keypressMoveMap("{upArrow}", 3);
  //  Case 2    z1    B0    Ms
  // keypressMoveMap("{downArrow}", 3);
  //  Case 3    z1    B0    Me
  // keypressMoveMap("{leftArrow}", 3);
  //  Case 4    z1    B0    Mw
  // keypressMoveMap("{rightArrow}", 3);
  //  --------------------------
  //  Case 5    z1    B1    Mn
  //  Case 6    z1    B1    Ms
  //  Case 7    z1    B1    Me
  //  Case 8    z1    B1    Mw
  //  --------------------------
  //  Case 9    z1    B2    Mn
  //  Case 10    z1    B2    Ms
  //  Case 11    z1    B2    Me
  //  Case 12    z1    B2    Mw
  //  --------------------------
  //  Case 13    z2    B0    Mn
  //  Case 14    z2    B0    Ms
  //  Case 15    z2    B0    Me
  //  Case 16    z2    B0    Mw
  //  --------------------------
  //  Case 17    z2    B1    Mn
  //  Case 18    z2    B1    Ms
  //  Case 19    z2    B1    Me
  //  Case 20    z2    B1    Mw
});
