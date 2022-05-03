const {verifySignUp} = require("../middleware");
const controller = require("../controllers/message.controller");
const {body, validationResult} = require('express-validator');
const authJwt = require("../middleware/authJwt");
const multer  = require('multer')
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    if(file.mimetype == 'audio/aac') {
      cb(null, Date.now() + path.extname(file.originalname) + ".webm") //Appending extension
    } else{
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
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


  app.post("/api/message/send",[authJwt.verifyToken],controller.sendMessage);
  app.post("/api/message/uploadFile",[authJwt.verifyToken,upload.array('file')],controller.uploadFile);
  app.get("/api/message/:conversationId",[authJwt.verifyToken],controller.getMessagesByConversationId);
  app.post("/api/message/delete",[authJwt.verifyToken],controller.deleteMessage);
};
