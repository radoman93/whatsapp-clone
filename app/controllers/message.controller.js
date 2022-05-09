const db = require("../models");
const crypto = require('crypto');
const {validationResult} = require("express-validator");
const {
  ERR_SERVER_ERROR,
  ERR_MESSAGE_NOT_FOUND,
  ERR_VALIDATION,
  ERR_FB_TOKEN_NOT_FOUND
} = require("../config/error.config");
const {getPagination, getPagingData, sendPushNotification} = require("../utils/util");
const {Op} = require("sequelize");

exports.sendMessage = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const participants = await db.Participant.findAll({
    where: {
      [Op.and]: [{
        conversationId: req.body.conversationId
      },
        {userId: {[Op.not]: req.userId}}]
    },
    include: [{
      model: db.User,
      as: 'user'
    }]
  })


  const user = await db.User.findOne({
    where: {
      id: req.userId
    }
  })

  console.log("SENDER",user.toJSON());

  const message = await db.Message.create({
    guid: crypto.randomUUID(),
    conversationId: req.body.conversationId,
    senderId: req.userId,
    message: req.body.message,
    messageType: req.body.messageType
  })

  for (let participant of participants) {
    console.log(participant.toJSON());
    if (participant.user.fbToken) {

      const notification = {
        notification: {
          title: 'New Message',
          body: req.body.message,
        },
        data: {
          type: "MESSAGE",
          sender: JSON.stringify(participant.user.toJSON()),
          content: JSON.stringify(message.toJSON())
        },
        token: participant.user.fbToken
      }
      sendPushNotification(notification)
    }
  }

  res.status(200).send(message)



}

exports.uploadFile = async (req, res) => {

  const message = await db.Message.create({
    guid: crypto.randomUUID(),
    conversationId: req.body.conversationId,
    senderId: req.userId,
    message: req.body.messageType,
    messageType: req.body.messageType
  })


  for (let file of req.files) {
    const attachment = await db.Attachment.create({
      // {
      //         "fieldname": "file",
      //         "originalname": "1.jpeg",
      //         "encoding": "7bit",
      //         "mimetype": "image/jpeg",
      //         "destination": "uploads/",
      //         "filename": "1650890332841.jpeg",
      //         "path": "uploads\\1650890332841.jpeg",
      //         "size": 337103
      //     }
      messageId: message.id,
      fileUrl: `uploads/${file.filename}`
    })
  }
  res.send(req.files)
}


exports.getMessagesByConversationId = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({error: ERR_VALIDATION, error_type: "ERR_VALIDATION", error_content: errors.array()});
  }

  const {page, size} = req.query;
  const {limit, offset} = getPagination(page, size);


  try {
    const data = await db.Message.findAndCountAll({
      where: {
        conversationId: req.params.conversationId
      },
      limit, offset,
      include: [{
        model: db.Attachment
      },
        {
          model: db.Deleted_Messages
        }],
      order: [
        ['createdAt', 'DESC'],
      ]
    })
    const response = getPagingData(data, page, limit);
    res.status(200).send(response)
  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message})
  }

};


exports.deleteMessage = async (req, res) => {
  try {
    const message = await db.Message.findOne({
      subQuery: false,
      where: {
        [Op.and]: [
          {
            id: req.body.messageId,
            senderId: req.userId
          }
        ]
      }
    })

    if (message) {
      const deleted_conversation = await db.Deleted_Messages.findOrCreate({
        where: {
          userId: req.userId,
          messageId: req.body.messageId
        },
        defaults: {
          conversationId: req.body.conversationId,
          userId: req.userId,
        }
      })
      res.status(200).send(deleted_conversation)
    } else {
      res.status(404).send({error: ERR_MESSAGE_NOT_FOUND, error_type: "ERR_MESSAGE_NOT_FOUND", error_content: ''})
    }


  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message});
  }
};
