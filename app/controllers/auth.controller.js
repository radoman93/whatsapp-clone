const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const {ERR_USER_REGISTER, ERR_VALIDATION, ERR_USER_NOT_FOUND, ERR_SERVER_ERROR} = require("../config/error.config");

exports.signup = (req, res) => {
  // Save User to Database
  db.User.create({
    phone: req.body.phone,
    otp: 1111
  })
    .then(user => {
      res.send({message: "User registered successfully!"});
    })
    .catch(err => {
      res.status(500).send({
        error: ERR_USER_REGISTER,
        error_type: "ERR_USER_REGISTER",
        error_content: err.message
      });
    });
};

exports.signin = (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({error: ERR_VALIDATION, error_type: "ERR_VALIDATION", error_content: errors.array()});
  }
  db.User.findOne({
    where: {
      phone: req.body.phone,
    }
  })
    .then( async (user) => {
      if (!user) {
        return res.status(404).send({error: ERR_USER_NOT_FOUND, error_type: "ERR_USER_NOT_FOUND", error_content: "User not found"});
      }
      const passwordIsValid = req.body.otp == user.otp
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid OTP!"
        });
      }

      if(req.body.fbToken) {
        user.fbToken = req.body.fbToken
        await user.save()
      }

      const token = jwt.sign({id: user.id}, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePhoto: user.profilePhoto,
        accessToken: token,
        phone: user.phone,
      });
    })
    .catch(err => {
      res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: err.message});
    });
};
