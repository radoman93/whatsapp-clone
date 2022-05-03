const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { ExpressPeerServer } = require('peer');

const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Whatsapp Clone',
      version: '1.0.0',
    },
  },
  apis: ['./app/routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(swaggerOptions);
app.use(express.json());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, {explorer: true})
);

app.use(cors());
app.use('/uploads', express.static('uploads'))

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));







// database
const db = require("./app/models");
const Role = db.role;

// db.sequelize.sync();
// force: true will drop the table if it already exists
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


// simple route
app.get("/", (req, res) => {
  res.json({message: "Welcome to bezkoder application."});
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/chat.routes')(app);
require('./app/routes/conversation.routes')(app);
require('./app/routes/message.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;



const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
});


const peerServer = ExpressPeerServer(server, {
  port:8080,
  allow_discovery: true,
  debug:true,
  path: '/myapp',
});

app.use('/peerjs', peerServer);


