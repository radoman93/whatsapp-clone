const admin = require("firebase-admin")

exports.getPagination = (page, size) => {
  const limit = size ? +size : 1;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {

  const { count: totalItems, rows: rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, data:data.rows, totalPages, currentPage };
};

exports.sendPushNotification = async (message) => {
  try {
    const response = await admin.messaging().send(message)
    console.log("Successfully sent message: ", response);
  } catch (error) {
    console.log("Error sending message: ", error);
  }
}
