/*======*\
|  SHIP  |
\*======*/

/* description pending */

class Ship extends GameObject {
  constructor(pos, radians, hitbox) {
    try {
      super(pos, radians, ((hitbox === undefined) ? {left: -10, top: -15, right: 10, bottom: 15} : hitbox));
    } catch (e) {
      throw new Error("Ship failed to construct due to failure in parent: " + e.message);
    }

    this.velocity = [0, 0];
    this.velocityDecay = 0.00005;
    this.velocityCap = 1;
    this.speed = 0.00025;

    this.angularVelocity = 0;
    this.angularDecay = 0.00000000025;
    this.angularCap = 0.5;
    this.angularSpeed = 0.000025;
  }

  set velocity(velocity) {
    let temp;

    if ((temp = typeof velocity) !== "object") {
      throw new Error("Ship expected array for velocity, but got " + temp + "!");
    }

    if (typeof(velocity[0] + velocity[1]) !== "number") {
      throw new Error("Ship did not get number values for both velocity values!");
    }

    this._velocity = [velocity[0], velocity[1]];
  }

  get velocity() {
    return this._velocity;
  }


  update(dt) {
  }

  draw(ctx, rel) {
    let size = 20;

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "black"
    ctx.save();
    ctx.translate(rel[0], rel[1]);
    ctx.rotate(this.radians);
    ctx.beginPath();
    ctx.moveTo(size / 2, size * 0.75);
    ctx.lineTo(0, size / 2);
    ctx.lineTo(-size / 2, size * 0.75);
    ctx.lineTo(0, -size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
