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

// sharks
var sharkAnimation;
var sharks = [];

// bubbles
var bubbleAnimation;


// preload animations
function preload() {
  // preload start gui animation
  castStartAnimation = loadAnimation("images/castStart/Frame001.png", "images/castStart/Frame012.png");
  
  // bubble animations
  // bubbleAnimation = loadAnimation()

  //fish animations
  fish1Animation = loadAnimation("images/greenFish/greenFish0000.png", "images/greenFish/greenFish0090.png");
  sharkAnimation = loadAnimation("images/sharks/shark0000.png", "images/sharks/shark0090.png");
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

  for (var i = 0; i < 3; i++) {
    sharks.push(new Shark());
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
    // DRAW AND DELETE FISH
    // check to see if mocap x,y is over image x,y
    // use mousex, mousey for now

    // FISHES
    var fishToBeDeleted = -1;
    for (var i = 0; i < fishes.length; i++) {
      // if not deleted, keep moving
      fishes[i].move();
      fishes[i].display();

      if ((mouseX > fishes[i].x) && (mouseX < fishes[i].x + 80) && (mouseY > fishes[i].y) && (mouseY < fishes[i].y + 80)) {
        //delete fish from array
        fishToBeDeleted = i;
        console.log(fishToBeDeleted);
        // console.log("HOVER: " + fishes[i].x + ", " + fishes[i].y);
      }
    }

    if (fishToBeDeleted > -1) {
      fishes.splice(fishToBeDeleted, 1);
    }

    // SHARKS
     var sharksToBeDeleted = -1;
     for (var i = 0; i < sharks.length; i++) {
       // if not deleted, keep moving
       sharks[i].move();
       sharks[i].display();

       if ((mouseX > sharks[i].x) && (mouseX < sharks[i].x + 100) && (mouseY > sharks[i].y) && (mouseY < sharks[i].y + 100)) {
         //delete fish from array
         sharksToBeDeleted = i;
         console.log(sharksToBeDeleted);
         // console.log("HOVER: " + fishes[i].x + ", " + fishes[i].y);
       }
     }

     if (sharksToBeDeleted > -1) {
       sharks.splice(sharksToBeDeleted, 1);
     }
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
    var d = dist(mouseX, mouseY, 900 / 2, 350 / 2);
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
    // initial left side of the screen
  this.x = random(0, 900/9);
  this.y = random(0, 400);
  this.speed = 1;
  this.frame = 0;
  this.numFrames = 91;

  this.display = function () {
    this.frame = this.frame >= this.numFrames ? 0 : this.frame + 1;
    fish1Animation.changeFrame(this.frame);
    animation(fish1Animation, this.x, this.y);
  }

  this.move = function() {
    if (this.x > 900 + 100) {
      this.x = 0;
    }
    this.x += (-this.speed, this.speed);
  }
}

// Shark class
function Shark() {
  console.log("CREATING A SHARK");
    // initial left side of the screen
  this.x = random(0, 900 / 9);
  this.y = random(0, 400);
  this.speed = 1;
  this.frame = 0;
  this.numFrames = 91;

  this.display = function () {
    this.frame = this.frame >= this.numFrames ? 0 : this.frame + 1;
    sharkAnimation.changeFrame(this.frame);
    animation(sharkAnimation, this.x, this.y);
  }

  this.move = function () {
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
