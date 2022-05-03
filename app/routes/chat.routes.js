const {verifySignUp} = require("../middleware");
const controller = require("../controllers/chat.controller");
const {body, validationResult} = require('express-validator');
const authJwt = require("../middleware/authJwt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/chat/message/send",[authJwt.verifyToken],controller.sendMessage);
};
