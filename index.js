/**
 * You probably don't need to touch this file.
 * 
 * But all this is doing is making sure all of the files are served
 * and we won't get any CORS issues because we are using an actual server
 */
const express = require('express');
const http = require('http');
const path = require('path');

// Create our server application
const app = express();
const server = http.Server(app);

// Statically serve our `src` directory
app.use(express.static(path.resolve(__dirname, './src')));
app.use(express.static(path.resolve(__dirname, './lib')));

// Serve our `index.html` file
app.get('*', (req, res) => {
  const pathToHtml = path.resolve(__dirname, './index.html')
  res.sendFile(pathToHtml);
});

// Start a simple server at port 3000
// GO to http://localhost:3000/ to view app
server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/');
});
