// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/music', express.static(path.join(__dirname, 'music')));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
