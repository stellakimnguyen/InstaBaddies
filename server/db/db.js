// this file connects to our database mongodb
const mongoose = require('mongoose');

// Connect to MongoDB using the url stored in the dotenv
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the db ...');
  })
  .catch(err => {
    console.error(err);
  })