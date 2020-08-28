/*========*\
|  PLANET  |
\*========*/

/* description pending */

class Planet extends Celestial {
  constructor(orbiting, dist, radians, speed, size, mass, color) {
    try { //try to get the inherited properties from Celestial
      super(orbiting, dist + size, radians, speed / dist, size, mass, color);
    } catch (e) { //throw Celestial's error if one was caught. this will result in a neat little chain down the line
      throw new Error("Planet failed to construct due to failure in parent: " + e.message);
    }

    this.type = "planet";
  }
}
