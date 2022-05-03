const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const {ERR_VALIDATION, ERR_SERVER_ERROR} = require("../config/error.config");

exports.signup = async (req, res) => {

  try{
    const user =  await User.create({
      phone: req.body.phone,
      otp: 1111
    })

    res.send({message:"User registered successfully!"})
  } catch(error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message()});
  }

};

exports.sendMessage = (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({error: ERR_VALIDATION, error_type: "ERR_VALIDATION", error_content: errors.array()});
  }
  res.send("Send")
};
