/*========*\
|  PLAYER  |
\*========*/

/* description pending */

class Character extends Ship {
  constructor(pos, radians) {
    try {
      super(pos, radians, {left: -10, top: -15, right: 10, bottom: 15});
    }
    catch (e) {
      throw new Error("Character failed to construct due to failure in parent: " + e.message);
    }
  }

  update(dt) {
    let force = [0, 0], pol = 1, temp;

    if (keystates["32"]) { //Slow down faster if space is held down
      this.angularDecay = 0.00008;
      this.velocityDecay = 0.0004;
    } else {
      this.angularDecay = 0.00001;
      this.velocityDecay = 0.00005;
    }

    if (this.angularVelocity < 0) { //Remember that we were rotating clockwise
      pol = -1;
    }

    temp = Math.abs(this.angularVelocity) - this.angularDecay * dt;

    if (temp < 0) { //Don't let the velocity decay turn the velocity negative
      temp = 0;
    }
    if (temp > this.angularCap) { //Don't let the velocity go higher than the cap
      this.angularVelocit = this.angularCap;
    }

    this.angularVelocity = temp * pol;

    if (keystates["37"]) {
      this.angularVelocity -= this.angularSpeed * dt;
      pol = 1;
      if (this.angularVelocity < 0) {
        pol = -1;
      }
      if (Math.abs(this.angularVelocity) > this.angularCap) {
        this.angularVelocity = this.angularCap * pol;
      }
    }
    if (keystates["39"]) {
      this.angularVelocity += this.angularSpeed * dt;
      pol = 1;
      pol = 1;
      if (this.angularVelocity < 0) {
        pol = -1;
      }
      if (Math.abs(this.angularVelocity) > this.angularCap) {
        this.angularVelocity = this.angularCap * pol;
      }
    }

    this.radians += this.angularVelocity * dt;

    pol = 1;
    if (this.velocity[0] < 0) {
      pol = -1;
    }

    temp = Math.abs(this.velocity[0]) - this.velocityDecay * dt;

    if (temp < 0) {
      temp = 0;
    }

    if (temp > this.velocityCap) {
      temp = this.velocityCap;
    }

    this.velocity[0] = temp * pol;

    pol = 1;
    if (this.velocity[1] < 0) {
      pol = -1;
    }

    temp = Math.abs(this.velocity[1]) - this.velocityDecay * dt;

    if (temp < 0) {
      temp = 0;
    }

    if (temp > this.velocityCap) {
      temp = this.velocityCap;
    }

    this.velocity[1] = temp * pol;



    if (keystates["38"]) {
      force = [this.speed * dt * Math.sin(this.radians), -this.speed * dt * Math.cos(this.radians)];
    }
    if (keystates["40"]) {
      force = [-this.speed * dt * Math.sin(this.radians), this.speed * dt * Math.cos(this.radians)];
    }

    this.velocity = [this.velocity[0] + force[0], this.velocity[1] + force[1]];
    this.pos = [this.pos[0] + this.velocity[0] * dt, this.pos[1] + this.velocity[1] * dt];
  }
}
