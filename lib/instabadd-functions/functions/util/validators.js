const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
}

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}
/**
 * data is newUser inputted data
 */
exports.validateSignupData = (data) => {
  let errors = {};

  // must validate that NONE of properties are empty
  // && email must be valid email
  if (isEmpty(data.email)) {
    errors.email = 'Email must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  // validate password
  if (isEmpty(data.password)) {
    errors.password = 'Must not be empty';
  }
  // valide confirmPassword
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  // validate username
  if (isEmpty(data.username)) {
    errors.username = 'Must not be empty';
  }

  // At this point, we ONLY want to proceed if the errors object is EMPTY***********
  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  // if no keys / errors, then return true and empty error obj
  // else returns false and error obj
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

/**
 * supposed to validate existing user data
 */
exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  // if user bio is not empty
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    // https://website.com
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `https://${data.website.trim()}`
    } else {
      // has https already
      userDetails.website = data.website.trim();
    }
  }
  return userDetails;
}