const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 
 * @param {request object} req 
 * @param {response object} res 
 * @param {next function} next 
 * 
 * Authentificate a user using json web tokens. if a user is found, request that user and its token. If no user is found using a token, send a status 401 response object.
 */
const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await User.findOne({ _id: data._id, 'token': token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.user.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
}
module.exports = auth;