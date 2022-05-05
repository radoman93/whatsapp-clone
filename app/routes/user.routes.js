const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
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
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user/me",
    [authJwt.verifyToken],
    controller.getCurrentUser
  );
  app.post(
    "/api/user/edit/photo",
    [authJwt.verifyToken],
    upload.single('file'),
    controller.editPhoto
  );
  app.post(
    "/api/user/edit",
    [authJwt.verifyToken],
    controller.edit
  );
};
