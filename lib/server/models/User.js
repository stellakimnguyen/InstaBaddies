const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mongoose schema outlines the model used for the database. This schema has 3 required keys: username, password and email.
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' })
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  token: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
});

// create a json web token for an instance
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
  user.token = token;
  await user.save()
  return token
};

// logs users into application if they exist in db
userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  try {
    console.log('\nSearching in db based on your credentials ...')
    const user = await User.findOne({ email })
    // console.log('Found this user : ', user)
    if (!user) {
      throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      throw new Error({ error: 'Invalid login credentials' })
    }
    // console.log('Password is a match too !')
    return user
  } catch (error) {
    res.status(400).send(error)
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;