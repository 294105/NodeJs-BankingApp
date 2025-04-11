const express = require('express');
const connectDB = require('./src/config/database');
const app = require('./src/app');
require('dotenv').config();


const PORT = process.env.PORT || 5000;

connectDB();
const server = express();

server.use(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
