// Holds our socket server connection
let socket;

// create water video canvas
var water;
// has the player started the game
var isGamePlaying = false;

// GUI ANIMATION CAST TO START
var castStartAnimation;

// fish objects
var fish;

// bubble objects?

// // preload animations
function preload() {
  // start animation
  castStartAnimation = loadAnimation("images/GUI/castStart/start1.png", "images/GUI/castStart/start4.png");
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
        ellipse(x, y, 20, 20);
      }
    }
  );

  // Put your setup code here
  // you can delete this if you want
  createCanvas(1920, 1080);
  // CODE GOES HERE 
  // water video background
  water = createVideo('images/water.mp4');
  water.hide();
}

function draw() {
  // Any draw loop code goes here
  // we always want the water background
  // image(water, 0, 0);

  // Game has not started
  if (!isGamePlaying) {
    // animate cast to start the program
    animation(castStartAnimation, 1920 / 2, 1080 / 2);
  }

  // Game has started
  if (isGamePlaying) {

  }

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
  var d = dist(mouseX, mouseY, 1920 / 2, 1080 / 2);
  if (d < 100 && !isGamePlaying) {
    // delete animation by creating a new canvas for the game to begin
    image(water, 0, 0);
    // begin the game
    isGamePlaying = true;
    gameStart();
  }
}

function gameStart() {
  water.loop();
  // create 10 fish objects

  // tell the fish to start on one side of the screen

  // change x positions to move to the other side
  // change y positions to make them look dynamic
}
