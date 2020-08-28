/*=====*\
|  STAR |
\*=====*/

/* description pending */

class Star extends Celestial {
  constructor(size, mass, color) {
    try { //try to get the inherited properties from Celestial
      super("self", 0, 0, 0, size, mass, color);
    } catch (e) { //throw Celestial's error if one was caught. this will result in a neat little chain down the line
      throw new Error("Star failed to construct due to failure in parent: " + e.message);
    }

    this.type = "star";
  }
}