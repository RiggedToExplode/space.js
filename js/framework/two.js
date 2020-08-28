/*========*\
|  TWO.JS  |
\*========*/

function rand(lo, hi) { //Random integer function.
  return Math.floor(Math.random() * hi) + lo;
}

function toDegrees(radians) {
  return (radians / Math.PI) * 180;
}

function toRadians(degrees) {
  return (degrees / 180) * Math.PI;
}

var keystates = {}; //Initialize a keystates object to hold the codes and states of any keys pressed.
window.onkeyup = function(e) {
  keystates[e.keyCode] = false; //Set a key's state to false when it is let go.
};
window.onkeydown = function(e) {
  keystates[e.keyCode] = true; //Set a key's state to true when it is pushed down.
};



/*============*\
|  GAMEOBJECT  |
\*============*/

/* The very basic constructor that every single object is going to inherit from.
  Ships, planets, blocks, bullets. Anything that is created is going to inherit
  its most basic values (such as position) from here. GameObject also serves as a
  basic class to test the framework and make sure it is working. */

class GameObject {
  constructor(pos = [10, 10], radians = 0, hitbox = { left: -5, top: -5, right: 5, bottom: 5 }) {
    this.type = "gameobject";
    this.category = "gameobject";

    try {
      this.pos = pos;
      this.radians = radians;
      this.hitbox = hitbox;
    } catch (e) {
      throw new Error("GameObject failed to construct due to: " + e.message);
    }
  }


  set pos(pos) {
    let temp;

    if ((temp = typeof pos) !== "object") { //Make sure that pos is an array.
      throw new Error("GameObject expected array for pos, but got " + temp + "!");
    }

    if (typeof(pos[0] + pos[1]) !== "number") { //Make sure that the two array values are numbers.
      throw new Error("GameObject expected numbers for pos values, but got something different!");
    }

    this._pos = [pos[0], pos[1]]; //Set only the two array values we need. Ignore any that come after.
  }

  get pos() {
    return this._pos;
  }

  set radians(radians) {
    let temp;

    if ((temp = typeof radians) !== "number") { //Make sure that radians is a number.
      throw new Error("GameObject expected number for radians, but got " + temp + "!");
    }

    this._radians = radians; //Set the value; it is safe.
  }

  get radians() {
    return this._radians;
  }

  set degrees(degrees) {
    let temp;

    if ((temp = typeof degrees) !== "number") {
      throw new Error("GameObject expected number for degrees, but got " + temp + "!");
    } else {
      this._radians = (degrees / 180) * Math.PI;
    }
  }

  get degrees() {
    return (this._radians / Math.PI) * 180;
  }

  set hitbox(newHitbox) {
    let temp;

    //I'm starting to get really tired of writing formal comments like this.
    //so im not going to bother anymore

    if ((temp = typeof newHitbox) !== "object") { //fail if we aren't given an object. we shouldn't be given anything other than a object.
      throw new Error("GameObject expected object for newHitbox, but got " + temp + "!");
    }

    if (typeof(newHitbox.left + newHitbox.top + newHitbox.right + newHitbox.bottom) !== "number") { //all the hitbox properties should be numbers. say 'fuck you' if they aren't numbers.
      throw new Error("GameObject expected numbers for newBounds values, but got something else!");
    }

    this._hitBox = { //only set the four values we expect to use. don't do, for example, this.hitBox = hitBox. Then, anyone could add some 'foo' property that doesn't need to be there.
      left: newHitbox.left,
      top: newHitbox.top,
      right: newHitbox.right,
      bottom: newHitbox.bottom,
      width: newHitbox.right - newHitbox.left, //Set width and height values that we might need later indirectly
      height: newHitbox.bottom - newHitbox.top
    };
  }

  get hitbox() {
    return this._hitBox;
  }

  set world(world) {
    let temp;

    if ((temp = typeof world) !== "object") { //throw an error if world isn't an object
      throw new Error("GameObject expected object for world, but got " + temp + "!");
    }

    if ((temp = world.category) !== "world") { //throw an error if world isn't a world. we're using category because the world might have a more specific type, like 'system' or 'pocket-dimension'
      throw new Error("GameObject expected object of category 'world' for world, but got '" + temp + "'!");
    }

    if (this.world) { //remove this object from its previous world, if it had one.
      this.world.removeObject(this.world.objects.indexOf(this));
    }

    this._world = world; //set the new world value
  }

  get world() {
    return this._world;
  }


  update(dt) { //A basic GameObject doesn't bother updating, but this is meant to be redefined for any children of this class.

  }

  draw(ctx, rel) { //A default draw function. this will be called by the camera.
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";

    ctx.save(); //Save the context since we are going to translate and rotate it.
    ctx.translate(rel[0], rel[1]);
    ctx.rotate(this.radians);
    ctx.beginPath();
    ctx.rect(this.hitBox.left, this.hitBox.top, this.hitBox.width, this.hitBox.height); //We should be at [0, 0] so just define the rectangle by the hitbox values.
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore(); //Restore the context.
  }
}



/*=======*\
|  WORLD  |
\*=======*/

/* The world object is the object that contains all of our GameObjects.
   It is barely anything more than an array, but it is what objects will reference
   to get a sense of their surroundings, and cameras will reference it to draw
   everything.*/

class World {
  constructor() {
    this.type = "world"; //This is a world.
    this.category = "world"; //In broader terms, this is a world.

    this.objects = []; //The array that will hold our objects.
  }


  set type(type) {
    let temp;

    if ((temp = typeof type) !== "string") { //Make sure type is a string.
      throw new Error("World expected string for type, but got " + temp + "!");
    }

    this._type = type;
  }

  get type() {
    return this._type;
  }

  set category(category) {
    let temp;

    if ((temp = typeof category) !== "string") { //Make sure category is a string.
      throw new Error("World expected string for category, but got " + temp + "!");
    }

    this._category = category;
  }

  get category() {
    return this._category;
  }

  set objects(objects) {
    this._objects = objects;
  }

  get objects() {
    return this._objects;
  }

  addObject(object) {
    let temp;

    if ((temp = typeof object) !== "object") {
      throw new Error("World.addObject expected object but got " + temp + "!");
    }

    temp = this.objects.length;
    object.world = this;
    this.objects.push(object);
    return temp;
  }

  moveObject(oldIndex, newIndex) {
    if (typeof(oldIndex + newIndex) === "number") { //Make sure that oldIndex and newIndex are both numbers.
      if (newIndex >= this.objects.length) { //I copied this chunk off StackOverflow, so I don't really knw how it works.
        temp = newIndex - this.objects.length + 1; //But it is meant to move the item at oldIndex to newIndex, and create undefined values if newIndex is beyond the length of the array.
        while (temp--) {
          this.objects.push(undefined);
        }
      }

      this.objects.splice(newIndex, 0, this.objects.splice(oldIndex, 1)[0]);
    } else {
      throw new Error("World.moveObject did not get numbers for both of its parameters!"); //Throw an error if we weren't given numbers.
    }
  }

  deleteObject(index, quiet = false) {
    let temp;

    if ((temp = typeof index) === "number") { //Make sure we were given a number.
      if (index > -1) {
        this.objects[index].delete((typeof quiet === "boolean" ? quiet : false)); //Call a delete function for the object in case it has any cleaning up it needs to do.
        //Quiet tells the object whether it should make its deletion known (e.g. explosion particles)
        this.objects.splice(index, 1); //Do the actual removal.
      } else {
        throw new Error("World.deleteObject got a negative number for index!"); //Throw an error if index is negative (can't have a negative index, or access one for that matter.)
      }
    } else {
      throw new Error("World.deleteObject expected number but got " + temp + "!"); //Throw an error if not given a number.
    }
  }

  update(dt) {
    this.objects.forEach(function(e) {
      e.update(dt);
    });
  }
}



/*========*\
|  CANVAS  |
\*========*/

/* This constructor creates a basic canvas object that only the Camera will need
   to access. All it has is the element its accessing, the context, some width and
   height values, and some methods to change them. */

class Canvas {
  constructor(id, width = 400, height = 200) {
    this.type = "canvas"; //This is a canvas.
    this.category = "canvas"; //In broader terms, this is a canvas.

    try { //Try to set our properties.
      this.id = id;
      this.width = width;
      this.height = height;
    } catch (e) { //Give up and throw an error if something failed.
      throw new Error("Canvas failed to construct due to: " + e.message);
    }
  }


  set id(id) {
    let temp;

    if ((temp = typeof id) !== "string") { //Make sure id is a string.
      throw new Error("Canvas expected string for id, but got " + temp + "!");
    }

    if ((temp = document.getElementById(id)) === undefined) { //Make sure that id indeed points us to an element that exists.
      throw new Error("Canvas got undefined for element with id '" + id + "'! Did you mistype the id?");
    }

    if (temp.tagName !== "CANVAS") { //Make sure that the element we are being pointed to is a canvas.
      throw new Error("Canvas got '" + temp.tagName + "' for element with id '" + id + "'! Did you give the wrong id?");
    }

    this._el = temp; //id is safe, so set the el property based on the id.
    this._ctx = this._el.getContext("2d"); //Get the context from the element.
    this._id = id; //Set the id as well.
  }

  get id() {
    return this._id;
  }

  set el(el) {
    return false;
  }

  get el() {
    return this._el;
  }

  set ctx(ctx) {
    return false;
  }

  get ctx() {
    return this._ctx;
  }

  set width(width) {
    let temp;

    if ((temp = typeof width) !== "number") { //Make sure width is a number.
      throw new Error("Canvas expected number for width, but got " + temp + "!");
    }

    if (width < 0) { //Don't let the width be negative.
      throw new Error("Canvas cannot have negative width!");
    }

    this._el.width = width;
    this._width = width;
  }

  get width() {
    return this._width;
  }

  set height(height) {
    let temp;

    if ((temp = typeof height) !== "number") { //Make sure height is a number.
      throw new Error("Canvas expected number for height, but got " + temp + "!");
    }

    if (height < 0) { //Don't let the height be negative.
      throw new Error("Canvas cannot have negative height!");
    }

    this._el.height = height;
    this._height = height;
  }

  get height() {
    return this._height;
  }

  set type(type) {
    let temp;

    if ((temp = typeof type) !== "string") { //Make sure type is a string.
      throw new Error("Canvas expected string for type, but got " + temp + "!");
    }

    this._type = type;
  }

  get type() {
    return this._type;
  }

  set category(category) {
    let temp;

    if ((temp = typeof category) !== "string") { //Make sure category is a string.
      throw new Error("Canvas expected string for category, but got " + temp + "!");
    }

    this._category = category;
  }

  get category() {
    return this._category;
  }
}



/*========*\
|  CAMERA  |
\*========*/

/*The Camera object is what draws the world. Each camera can be given a different
  canvas to draw on, a different world to draw from, different positions and areas
  to draw on the canvas, and even different areas of the world to look at. In
  addition, each Camera can be given a background and stroke color, which it will
  automatically apply if those values are defined. Each Camera
  also has a beforeDraw and afterDraw method that it calls before and after its
  draw method, respectively.*/

class Camera {
  constructor(target, bounds, source, pos, scale = [1, 1]) {
    this.type = "camera"; //This is a camera.
    this.category = "camera"; //In broader terms, this is a camera.

    try { //Try to set our properties.
      this.target = target;
      this.bounds = bounds;
      this.source = source;
      this.pos = pos;
      this.scale = scale;
    } catch (e) { //Give up and throw an error if something failed.
      throw new Error("Camera failed to construct due to: " + e.message);
    }
  }


  set target(target) {
    let temp;

    if ((temp = typeof target) !== "object") { //Make sure target is an object.
      throw new Error("Camera expected object for target, but got " + temp + "!");
    }

    if ((temp = target.type) !== "canvas") { //Make sure target is of type 'canvas'.
      throw new Error("Camera expected object of type 'canvas' for target, but got '" + temp + "'!");
    }

    this._target = target; //Tests passed, so the value should be safe. Set it.
  }

  get target() {
    return this._target;
  }

  set bounds(newBounds) {
    let temp;

    if ((temp = typeof newBounds) !== "object") { //Make sure newBounds is an object.
      throw new Error("Camera expected object for newBounds, but got " + temp + "!");
    }

    if (typeof(newBounds.left + newBounds.top + newBounds.right + newBounds.bottom) !== "number") { //Make sure that the four important values are all numbers.
      throw new Error("Camera expected numbers for newBounds values, but was given something different!");
    }

    if (newBounds.right - newBounds.left < 0) { //Make sure we don't end up with a camera with negative width.
      throw new Error("Camera will have negative width!");
    }

    if (newBounds.bottom - newBounds.top < 0) { //Make sure we don't end up with a camera with negative height.
      throw new Error("Camera will have negative height!");
    }

    //Tests passed, so the value should be safe. Set it.
    this._bounds = { //Only set the six values that bounds is supposed to have. If we're given some newBounds.bar for example, don't set that because it shouldn't be there. Also indirectly set a width and height value.
      left: newBounds.left,
      top: newBounds.top,
      right: newBounds.right,
      bottom: newBounds.bottom,
      width: newBounds.right - newBounds.left,
      height: newBounds.bottom - newBounds.top
    };
  }

  get bounds() {
    return this._bounds;
  }

  set source(source) {
    let temp;

    if ((temp = typeof source) !== "object") { //Make sure that source is an object.
      throw new Error("Camera expected object for source, but got " + temp + "!");
    }

    if ((temp = source.category) !== "world") { //Make sure that source is of category 'world'. we're using category because the world might have a more specific type, like 'system' or 'pocket-dimension'
      throw new Error("Camera expected object of category 'world' for source, but got '" + temp + "'!");
    }

    this._source = source; //Tests passed, so the value should be safe. Set it.
  }

  get source() {
    return this._source;
  }

  set pos(pos) {
    let temp;

    if ((temp = typeof pos) !== "object") { //Make sure pos is an array.
      throw new Error("Camera expected array for pos, but got " + temp + "!");
    }

    if (typeof(pos[0] + pos[1]) !== "number") { //Make sure that the two coordinates are numbers.
      throw new Error("Camera expected numbers for pos values, but was given something different!");
    }

    //Tests passed, so the value must be safe. Set it.
    this._pos = [pos[0], pos[1]]; //Only set pos with two indices. If the pos we were given had more than two, ignore them.
  }

  get pos() {
    return this._pos;
  }

  set scale(scale) {
    let temp;

    if ((temp = typeof scale) !== "object") { //Make sure scale is an array.
      throw new Error("Camera expected array for scale, but got " + temp + "!");
    }

    if (typeof(scale[0] + scale[1]) !== "number") { //Make sure that the two values are numbers.
      throw new Error("Camera expected numbers for scale values, but was given something different!");
    }

    //Tests passed, so the value must be safe. Set it.
    this._scale = [scale[0], scale[1]]; //Only set scale with two indices. If the scale we were given had more than two, ignore them.
  }

  get scale() {
    return this._scale;
  }

  set background(background) {
    let temp;

    if ((temp = typeof background) !== "string") { //Make sure background is a string.
      throw new Error("Camera expected string for background, but got " + temp + "!");
    }

    this._background = background; //We aren't very sure that background is safe, since we are too lazy to check that it is a hex, rgb, or other color value that Context will recognize. But let's use it anyway.
  }

  get background() {
    return this._background;
  }

  set stroke(stroke) {
    let temp;

    if ((temp = typeof stroke) !== "string") { //Make sure stroke is a string.
      throw new Error("Camera expected string for stroke, but got " + temp + "!");
    }

    this._stroke = stroke; //We aren't very sure that stroke is safe, since we are too lazy to check that it is a hex, rgb, or other color value that Context will recognize. But let's use it anyway.
  }

  get stroke() {
    return this._stroke;
  }

  set lineWidth(lineWidth) {
    let temp;

    if ((temp = typeof lineWidth) !== "number") { //Make sure lineWidth is a number.
      throw new Error("Camera expected number for lineWidth, but got " + temp + "!");
    }

    if (lineWidth < 0) {
      throw new Error("Camera was given a negative number for new lineWidth!");
    }

    this._lineWidth = lineWidth;
  }

  get lineWidth() {
    return this._lineWidth;
  }

  set type(type) {
    let temp;

    if ((temp = typeof type) !== "string") { //Make sure type is a string.
      throw new Error("Camera expected string for type, but got " + temp + "!");
    }

    this._type = type;
  }

  get type() {
    return this._type;
  }

  set category(category) {
    let temp;

    if ((temp = typeof category) !== "string") { //Make sure category is a string.
      throw new Error("Camera expected string for category, but got " + temp + "!");
    }

    this._category = category;
  }

  get category() {
    return this._category;
  }


  beforeDraw(ctx) { //Called by draw() before the main target.forEach loop. By default it is used to draw a background and outline for the camera. Anything drawn here will be drawn over by draw() and drawAfter().
    if (this.background) {
      ctx.fillStyle = this.background; //Fill a background if this camera is given a background color.

      ctx.fillRect(this.bounds.left, this.bounds.top, this.bounds.width, this.bounds.height);
    }

    if (this.stroke) {
      ctx.strokeStyle = this.stroke; //Draw an outline if this camera is given an outline color.

      if (this.lineWidth) { //Change the stroke width if this camera has a specific one set.
        ctx.lineWidth = this.lineWidth;
      } else {
        ctx.lineWidth = 1;
      }

      ctx.strokeRect(this.bounds.left, this.bounds.top, this.bounds.width, this.bounds.height);
    }
  }

  afterDraw(ctx) { //Called by draw() after the main target.forEach loop. Empty by default. Anything drawn here will draw over draw() and beforeDraw(). Use this for overlays, crosshairs, etc.

  }

  draw() { //Called by a draw loop.
    let ctx = this.target.ctx,
      pos = this.pos,
      bounds = this.bounds,
      scale = this.scale;

    this.beforeDraw(ctx);

    ctx.beginPath();
    ctx.save(); //Save the context since we're going to clip and possibly scale it.

    ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);
    ctx.clip(); //Clip the context so that nothing is drawn past the bounds of this camera.

    if (scale !== [1, 1]) { //If we are drawing at any scale other than [1, 1], then set it.
      ctx.scale(scale[0], scale[1]);
    }

    this.source.objects.forEach(function(e) { //Call draw() for every object in the world this camera is drawing.
      e.draw(ctx, [e.pos[0] - pos[0] + bounds.left / scale[0], e.pos[1] - pos[1] + bounds.top / scale[1]]);
      //Every object expects what context it is drawing on, and its position on that context.
    });

    ctx.restore(); //Restore the context.
    ctx.closePath();

    this.afterDraw(ctx);
  }
}
