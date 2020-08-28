/*===========*\
|  CELESTIAL  |
\*===========*/

/* Description pending */



class Celestial extends GameObject {
  constructor(orbiting, dist, radians, speed, size, mass, color) {
    try { //try to get the inherited properties from GameObject
      super([0, 0], radians, { left: -size, top: -size, right: size, bottom: size });
    } catch (e) { //throw GameObject's error if one was caught. this will result in a neat little chain down the line
      throw new Error("Celestial failed to construct due to failure in parent: " + e.message);
    }

    this.type = "celestial"; //this is a celestial
    this.category = "celestial"; //still a celestial, just in broader terms

    this.satellites = [];

    try {
      this.orbiting = orbiting;
      this.dist = dist;
      this.speed = speed / 2400000;
      this.size = size;
      this.mass = mass;
      this.color = color;
    } catch (e) {
      throw new Error("Celestial failed to construct due to: " + e.message);
    }
  }


  set orbiting(orbiting) {
    let temp;

    switch (temp = typeof orbiting) {
      case "object":
        if (this.orbiting !== undefined) {
          if (this.orbiting.removeSatellite !== undefined && (temp = this.orbiting.satellites.indexOf(this)) !== -1) {
            this.orbiting.removeSatellite(temp); //remove this from the previous orbiting object's satellites, if we had a previous one.
          }
        }

        this._orbiting = orbiting;
        break;
      case "string":
        if (orbiting === "self") {
          if (this.orbiting !== undefined) {
            if (this.orbiting.removeSatellite !== undefined && (temp = this.orbiting.satellites.indexOf(this)) !== -1) {
              this.orbiting.removeSatellite(temp); //remove this from the previous orbiting object's satellites, if we had a previous one.
            }
          }

          this._orbiting = this;
        } else {
          throw new Error("Celestial expected 'self' for string, but got '" + orbiting + "'!");
        }
        break;
      default:
        throw new Error("Celestial expected object or string for orbiting, but got " + temp + "!");
    }
  }

  get orbiting() {
    return this._orbiting;
  }

  set dist(dist) {
    let temp;

    if ((temp = typeof dist) !== "number") {
      throw new Error("Celestial expected number for dist, but got " + temp + "!");
    }

    if (dist < 0) {
      throw new Error("Celestial got a negative number for dist!");
    }

    this._dist = dist;
  }

  get dist() {
    return this._dist;
  }

  set speed(speed) {
    let temp;

    if ((temp = typeof speed) !== "number") {
      throw new Error("Celestial expected number for speed, but got " + temp + "!");
    }

    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set size(size) {
    let temp;

    if ((temp = typeof size) !== "number") {
      throw new Error("Celestial expected number for size, but got " + temp + "!");
    }

    if (size < 0) {
      throw new Error("Celestial got a negative number for size!");
    }

    this._size = size;
  }

  get size() {
    return this._size;
  }

  set mass(mass) {
    let temp;

    if ((temp = typeof mass) !== "number") {
      throw new Error("Celestial expected number for mass, but got " + temp + "!");
    }

    this._mass = mass;
  }

  get mass() {
    return this._mass;
  }

  set color(color) {
    let temp;

    if ((temp = typeof color) !== "string") {
      throw new Error("Celestial expected string for color, but got " + temp + "!");
    }

    this._color = color;
  }

  get color() {
    return this._color;
  }

  set satellites(satellites) {
    this._satellites = satellites;
  }

  get satellites() {
    return this._satellites;
  }


  addSatellite(satellite) {
    let temp;

    if ((temp = typeof satellite) !== "object") {
      throw new Error("Celestial expected object for satellite, but got " + temp + "!");
    }

    temp = this.satellites.length;
    satellite.orbiting = this;
    this.satellites.push(satellite);
    return temp;
  }

  moveSatellite(oldIndex, newIndex) {
    if (typeof(oldIndex + newIndex) === "number") { //Make sure that oldIndex and newIndex are both numbers.
      if (newIndex >= this.satellites.length) { //I copied this chunk off StackOverflow, so I don't really knw how it works.
        temp = newIndex - this.satellites.length + 1; //But it is meant to move the item at oldIndex to newIndex, and create undefined values if newIndex is beyond the length of the array.
        while (temp--) {
          this.satellites.push(undefined);
        }
      }

      this.satellites.splice(newIndex, 0, this.satellites.splice(oldIndex, 1)[0]);
    } else {
      throw new Error("Celestial.moveSatellite did not get numbers for both of its parameters!"); //Throw an error if we weren't given numbers.
    }
  }

  removeSatellite(index) {
    let temp;

    if ((temp = typeof index) === "number") { //Make sure we were given a number.
      if (index > -1) {
        this.satellites.splice(index, 1); //Do the actual removal.
      } else {
        throw new Error("Celestial.deleteSatellite got a negative number for index!"); //Throw an error if index is negative (can't have a negative index, or access one for that matter.)
      }
    } else {
      throw new Error("Celestial.deleteSatellite expected number but got " + temp + "!"); //Throw an error if not given a number.
    }
  }

  update(dt) {
    if (this.speed) {
      this.radians += this.speed * this.dist * dt;
      if (this.radians > Math.PI * 2) {
        this.radians -= Math.PI;
      }
    }

    if (this.orbiting !== this) {
      this.pos[0] = this.orbiting.pos[0] + this.dist * Math.cos(this.radians);
      this.pos[1] = this.orbiting.pos[1] + this.dist * Math.sin(this.radians);
    }
  }

  draw(ctx, rel) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(rel[0], rel[1], this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
