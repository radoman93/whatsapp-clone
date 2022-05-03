
const db = require("../models");
const {ERR_SERVER_ERROR} = require("../config/error.config");


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getCurrentUser =  async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: req.userId
      }
    })
    res.status(200).send(user)

  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message()})
  }
};

exports.editPhoto =  async (req, res) => {
  const file = req.file;
  try {
    const user = await db.User.findOne({
      where: {
        id: req.userId
      }
    })
    user.profilePhoto = `uploads/${file.filename}`
    await user.save()
    res.status(200).send(user)

  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message()})
  }
};

exports.edit =  async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: {
        id: req.userId
      }
    })
    Object.assign(user, req.body)
    await user.save()
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message()})
  }
};
