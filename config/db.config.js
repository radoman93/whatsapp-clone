module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "123456",
  DB: "whatsapp_clone",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
