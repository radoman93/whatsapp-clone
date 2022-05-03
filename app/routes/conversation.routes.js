const {verifySignUp} = require("../middleware");
const controller = require("../controllers/conversation.controller");
const {body, validationResult} = require('express-validator');
const authJwt = require("../middleware/authJwt");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/conversation", [authJwt.verifyToken], controller.getAllConversations);
  app.get("/api/conversation/:conversationId", [authJwt.verifyToken], controller.getConversationById);
  app.post("/api/conversation/:conversationId/edit/photo", [authJwt.verifyToken], upload.single('file'), controller.editPhoto);
  app.post("/api/conversation/search", [authJwt.verifyToken], controller.searchConversations);
  app.post("/api/conversation/delete", [authJwt.verifyToken], controller.deleteConversation);
};
