require('dotenv').config();
const express = require('express');
require('./db/db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
// reate this uploads folder and create a static path reference to it
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} ...`);
});