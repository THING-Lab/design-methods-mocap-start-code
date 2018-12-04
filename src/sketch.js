// Holds our socket server connection
const socket;

function setup() {
  // DONT CHANGE THIS, connection to mocap server
  socket = io('192.168.0.100:8000');
  // Setup a listener for the frame event containing rigid body data
  socket.on(
    'frame',
    function(data) {
      // PLACE YOUR CODE FOR HANDLING DATA HERE

      // Data here is an array of the rigid body objects from QTM
      // [{ x: int, y: int, z: int } ...]
      // x is the short side - max 3600 - min -2000
      // y is the long side - max 3500 - min -3500
      // If the body loses tracking, all three values will be null

      // Ex of drawing a circle with x and y coords from a rigid body
      if (data[0].y !== null) {
        // Draw a blue circle
        background(0);
        fill(0, 0, 255);
        noStroke();

        // Map between two ranges
        const x = (1 - (data[0].y + 3500) / 7000) * 1000;
        const y = (1 - (data[0].x + 2000) / 5600) * 400;
        ellipse(x, y, 20, 20);
      }
    }
  );

  createCanvas(1000, 400);
  background(0);
}

function draw() {
  // Any draw loop code goes here

  // For debugging use `console.log` and open up the browser's inspector
}
