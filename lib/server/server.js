const r = require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/user');
require('./db/db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(userRouter);



// call express to liston on a port number
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} ...`);
});