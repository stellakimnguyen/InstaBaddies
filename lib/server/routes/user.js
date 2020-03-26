const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  console.log(req.headers);
})

router.post('/users', async (req, res) => {
  try {
    console.log('we are here');
    const user = new User(req.body);
    await user.save()
    const token = await user.generateAuthToken();
    res.status(201).send({ user })
  } catch (err) {
    console.log('we are here but with an error');
    res.status(400).send(err);
  }
});

// should rename route **
router.post('/users/login', async (req, res) => {
  console.log('we are in post in router!');
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({ error: 'Login failed: Check authentication credentials' });
    }
    const token = await user.generateAuthToken();
    res.send({ user });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.post('/users/me/logout', auth, async (req, res) => {
  try {
    req.user.token = '';
    await req.user.save();
    res.send({ message: 'Successfully logged out of the application' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/users/:id', getUser, (req, res) => {
  res.json(res.user);
})

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).send({ message: "User with this id does not exist" })
    }
    res.user = user;
    res.status(200).send(user);
  } catch (error) {
    console.log('Error in system')
    return res.status(500).json({ message: error.message });
  }
  next();
}

module.exports = router;