const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { body, validationResult } = require('express-validator');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth",
    [
      verifySignUp.checkIfUserExists,
    ],
    controller.signup
  );

  app.post("/api/auth/verify",
    [
      body('phone')
        .exists()
        .withMessage("Phone Required")
        .isString()
        .withMessage("Phone Must be a string")
        .notEmpty()
        .withMessage("Phone Must not be empty"),
      body('otp')
        .exists()
        .withMessage("OTP Is Required")
        .isNumeric()
        .withMessage("OTP must be a number")
        .notEmpty()
        .withMessage("OTP must not be empty")
    ],controller.signin);
};
