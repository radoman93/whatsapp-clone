const db = require("../models");
const {ERR_PHONE_ALREADY_REGISTERED} = require("../config/error.config");
const ROLES = db.ROLES;
const User = db.user;

checkIfUserExists = (req, res, next) => {

  db.User.findOne({
    where: {
      phone: req.body.phone
    }
  }).then(user => {
    if (user) {
      res.status(200).send({
        message: 'Already exists. Please login'
      });
      return;
    }
    next()
  });
};

const verifySignUp = {
  checkIfUserExists: checkIfUserExists,
};

module.exports = verifySignUp;
