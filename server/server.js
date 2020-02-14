const r = require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');
require('./db/db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(userRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} ...`);
});