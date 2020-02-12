const r = require('dotenv').config();
const express = require('express');
require('./db/db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());




app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} ...`);
});