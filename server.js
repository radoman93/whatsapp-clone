const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const {ExpressPeerServer} = require('peer');
const app = express();
const admin = require("firebase-admin")
const db = require("./app/models");
const path = require("path");
const pathToServiceAccount = path.resolve("app/config/kroba-chat-firebase-adminsdk-cpbwp-2eea86f69e.json")
const serviceAccount = require(pathToServiceAccount)
const {sendPushNotification} = require("./app/utils/util");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

app.use(express.json());

app.use(cors());
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const force = true;
// db.sequelize.sync({force: force}).then(async () => {
//   console.log('Drop and Resync Database with { force: false }');
//   if (force){
//     initial();
//     mockData();
//   }
//
//   console.log(await db.conversation.findAll({include: ['participants']}));
//
//
// });

app.get("/", async (req, res) => {

  res.json({message: "Welcome to bezkoder application."});
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/chat.routes')(app);
require('./app/routes/conversation.routes')(app);
require('./app/routes/message.routes')(app);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, async () => {

  console.log(`Server is running on port ${PORT}.`);
});


const peerServer = ExpressPeerServer(server, {
  port: 8080,
  allow_discovery: true,
  debug: true,
  path: '/myapp',
});

app.use('/peerjs', peerServer);


