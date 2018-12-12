// Holds our socket server connection
let socket;

// positions
var mocapZ = 0;

// create water video canvas
var water;
// has the player started the game
var isGamePlaying = false;

// GUI ANIMATION CAST TO START
var castStart;
var castStartAnimation;

// fishes
var fish1Animation;
var fishes = [];

// preload animations
function preload() {
  // preload start gui animation
  castStartAnimation = loadAnimation("images/castStart/Frame001.png", "images/castStart/Frame012.png");
  //fish animations
  fish1Animation = loadAnimation("images/fish/gradientFish0.png", "images/fish/gradientFish9.png");
}

function setup() {

  // DONT CHANGE THIS, connection to mocap server
  socket = io('192.168.0.100:8000');
  // Setup a listener for the frame event containing rigid body data
  socket.on(
    'frame',
    function (data) {
      // PLACE YOUR CODE FOR HANDLING DATA HERE

      // Data here is an array of the rigid body objects from QTM
      // [{ x: int, y: int, z: int } ...]
      // x is the short side - max 3600 - min -2000
      // y is the long side - max 3500 - min -3500
      // If the body loses tracking, all three values will be null

      // Ex of drawing a circle with x and y coords from a rigid body
      // data[5] is bobber id for summer team
      if (data[5].y !== null) {
        // Draw a blue circle
        background(0);
        fill(0, 0, 255);
        noStroke();

        // Map between two ranges
        const x = (1 - (data[5].y + 3500) / 7000) * 1000;
        const y = (1 - (data[5].x + 2000) / 5600) * 400;
        mocapZ = (1 -(data[5].z + 2000) / 5600) * 400;
        ellipse(x, y, 20, 20);

        // positionvalues of the mocap
        console.log("X: " + data[5].x);
        console.log("Y: " + data[5].y);
         // make sure mocap is under 200 for it to activate
        console.log("Z: " + mocapZ);
      }
    }
  );

  // Put your setup code here
  // you can delete this if you want
  createCanvas(900, 400);
  // CODE GOES HERE 
  // water video background
  water = createVideo('images/water.mp4');
  water.hide();

  // create start gui
  castStart = new Start();

  // create an array of fish objects
  for (var i = 0; i < 5; i++) {
    fishes.push(new Fish());
  }
}

function draw() {
  // Any draw loop code goes here
  // we always want the water background
  image(water, 0, 0);

  // Game has not started
  if (!isGamePlaying) {
    // animate start gui
    castStart.display();
  }

  if (isGamePlaying) {
    // draw Fish on the screen
    console.log("GAME BEGIN");
      
    // check to see if mocap x,y is over image x,y
    // use mousex, mousey for now
    for (var i = 0; i < fishes.length; i++) {
      if ((mouseX > fishes[i].x) && (mouseX < fishes[i].x + 100) && (mouseY > fishes[i].y) && (mouseY < fishes[i].y + 100)) {
        //delete fish from array
        // fishes[i].pop();
        console.log("HOVER: " + fishes[i].x + ", " + fishes[i].y);
      }
      // if not deleted, keep moving
      fishes[i].move();
      fishes[i].display();
    }

  

    console.log("GAME END");

  }


  // MOACP
  // check for z threshold and x/y position for the game to start
  /*
  if (isGamePlaying == false) {}
    if (z < blah && x > bah) {
      gameStart();
      isGamePlaying = true;
    }
  } 

  // redraw background and fish

  if (isGamePlaying == true) {
    // check position of mocap against the position of all the fishes
    // compare player.x, player.y to fish.x,fish.y

    // if positions match
    // make fish disappear and draw bubble animation//
    draw over bubble animation
  }
   */
  // For debugging use `console.log` and open up the browser's inspector
}

// THIS IS HOW THE PROGRAM IS STARTED0
function keyPressed() {
  // water animation
  water.loop();
}

function mousePressed() {
  if (!isGamePlaying) {
    var d = dist(mouseX, mouseY, 900 / 2, 400 / 2);
    if (d < 100 && !isGamePlaying) {
      // delete animation by creating a new canvas for the game to begin
      isGamePlaying = true;
      water.loop();
      console.log("MOUSE PRESSED");
    }
  }
}

// Fish class
function Fish() {
  console.log("CREATING A FISH");
  var fishAnimation;
  // initial left side of the screen
  this.x = random(0, 900/9);
  this.y = random(0, 400);
  this.speed = 1;

  this.display = function () {
    animation(fish1Animation, this.x, this.y);
  }

  this.move = function() {
    if (this.x > 900 + 100) {
      this.x = 0;
    }
    this.x += (-this.speed, this.speed);
  }
}

function Start(){
  console.log("GRAB START GUI ANIMATIONS");

  this.display = function () {
    animation(castStartAnimation, 900/2, 400/2);
  }

}
