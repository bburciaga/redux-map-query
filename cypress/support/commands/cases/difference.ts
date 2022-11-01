/// <reference types="cypress" />
import { difference } from "@turf/turf";

declare global {
  interface Chainable {
    d0: typeof d0;
    d1: typeof d1;
  }
}

/**
 * Supposed to check if there isn't a difference
 * @param userBounds 
 * @param extent 
 */
export const d0 = (userBounds: any, extent: any) => {
  // return difference(userBounds, extent) === null;
}

/**
 * Supposed to check if there is a difference
 * @param userBounds 
 * @param extent 
 */
export const d1 = (userBounds: any, extent: any) => {
  // return difference(userBounds, extent) !== null;
}