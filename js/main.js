/*======*\
|  MAIN  |
\*======*/
var colors = ["red", "green", "blue"];

function toAU(km) {
  return km / 149598000;
}

function toKM(au) {
  return au * 149598000;
}

function squish(type, amount) {
  switch (type) {
    case "star":
      return amount / 360;
    case "dist":
      return amount / 178131;
    case "planet":
      return amount / 150;
    default:
      return null;
  }
}



var Canvas1 = new Canvas("canvas", window.innerWidth, window.innerHeight);
var System = new World();


var Camera1 = new Camera(Canvas1, { left: 0, top: 0, right: Canvas1.width, bottom: Canvas1.height }, System, [0, 0]); //Create our main camera
Camera1.background = "black";

var CameraMinimap = new Camera(Canvas1, { left: Canvas1.width - 400, top: 0, right: Canvas1.width, bottom: 200 }, System, [0, 0], [0.05, 0.05]); //Create the minimap
CameraMinimap.background = "#232323"; //Slightly lighter background as to differentiate from main camera
CameraMinimap.stroke = "white"; //Give it a white outline
CameraMinimap.afterDraw = function(ctx) {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";

  ctx.beginPath();
  ctx.arc(this.bounds.left + this.bounds.width / 2, this.bounds.top + this.bounds.height / 2, 2, 0, 2 * Math.PI); //Draw a visible circle in the center to denotate the player, otherwise the scale would make them almost invisible.
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};





//SOLAR SYSTEM RANDOM GENERATION
System.addObject(new Star(squish("star", rand(173877, 2782040)), 25000, "yellow"));
let prev = System.objects[0];

for (let temp = rand(1, 12); temp > 0; temp--) {
  let index = System.objects[0].addSatellite(new Planet(System.objects[0], squish("dist", rand(5800000, 588000000)) + prev.size + prev.dist, toRadians(rand(0, 360)), toRadians(rand(100, 2000)), squish("planet", rand(2400, 7000)), 5000, colors[rand(0, colors.length - 1)]));
  System.addObject(System.objects[0].satellites[index]); //Create a planet orbiting the star

  let prev2 = System.objects[0].satellites[index]; //Start by considering this planet as the "previous" moon
  let prevdist = 0; //The previous distance should be 0, since we're starting at the planet itself.
  for (let temp2 = rand(1, 4); temp2 > 0; temp2--) {
    let index2 = System.objects[0].satellites[index].addSatellite(new Planet(System.objects[0].satellites[index], squish("dist", rand(1500000, 4000000)) + prev2.size + prevdist, toRadians(rand(0, 360)), toRadians(rand(1000, 20000)), squish("planet", rand(300, 1000)), 500, colors[rand(0, colors.length - 1)]));
    System.addObject(System.objects[0].satellites[index].satellites[index2]); //Create the moon and add it
    prev2 = System.objects[0].satellites[index].satellites[index2]; //Set the moon as the previous moon
    prevdist = System.objects[0].satellites[index].satellites[index2].dist; //Set this moon's distance as the previous distance.
  }

  prev = System.objects[0].satellites[index];
}



//Create the player from the Character class, providing a (temporary) position and a degree of rotation
var Player = new Character([0, 0], 0);
//Set the player position at a random position around the star
let temp = toRadians(rand(0, 360));
let temp2 = rand(100, 400);
Player.pos[0] = System.objects[0].pos[0] + (temp2 + System.objects[0].size) * Math.cos(temp);
Player.pos[1] = System.objects[0].pos[1] + (temp2 + System.objects[0].size) * Math.sin(temp);
System.addObject(Player);

//Add another random ship for testing purposes.
var NPC = new Ship([0, 0], toRadians(rand(0, 360)));
temp = toRadians(rand(0, 360));
temp2 = rand(100, 400);
NPC.pos[0] = System.objects[0].pos[0] + (temp2 + System.objects[0].size) * Math.cos(temp);
NPC.pos[1] = System.objects[0].pos[1] + (temp2 + System.objects[0].size) * Math.sin(temp);
System.addObject(NPC);



//UPDATE LOOP
var lastUpdate = Date.now();
window.setInterval(function() {
  now = Date.now();
  dt = now - lastUpdate; //Find the amount of time (in milliseconds) since the update loop ran last.
  lastUpdate = now;

  System.update(dt);
}, 0);

//DRAW LOOP
window.setInterval(function() {
  Camera1.pos = [Player.pos[0] - Camera1.bounds.width / 2, Player.pos[1] - Camera1.bounds.height / 2]; //Move main camera to center on player.
  CameraMinimap.pos = [Player.pos[0] - CameraMinimap.bounds.width / CameraMinimap.scale[0] / 2, Player.pos[1] - CameraMinimap.bounds.height / CameraMinimap.scale[1] / 2]; //Move minimap to center on player.

  Camera1.draw();
  CameraMinimap.draw(); //Call draw on the two cameras.
}, 33);

//WINDOW RESIZE EVENT
window.addEventListener("resize", function() {
  Canvas1.width = window.innerWidth; //Change the canvas size to match the new window size.
  Canvas1.height = window.innerHeight;

  Camera1.bounds = { left: 0, top: 0, right: canvas.width, bottom: canvas.height }; //Change the camera's bounds to match the new canvas size.
});
