const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const {ERR_SERVER_ERROR, ERR_VALIDATION, ERR_CONVERSATION_NOT_FOUND} = require("../config/error.config");
const {getPagination, getPagingData} = require("../utils/util");
const crypto = require("crypto");
const {QueryTypes} = require("sequelize");

async function findAllWithTasks() {


  console.log("All users with their associated tasks:", JSON.stringify(users, null, 4));

}


exports.getAllConversations = async (req, res) => {

  const {page, size} = req.query;
  const {limit, offset} = getPagination(page, size);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  try {

    const subQuery = await db.sequelize.dialect.QueryGenerator.selectQuery('Participants',
      {
        attributes: ['conversationId'],
        where: {
          userId: 6,
        }
      })

    console.log("Sub",subQuery);

    const data = await db.Conversation.findAndCountAll({
      where: {
            id: {[Op.in]: db.sequelize.literal(`(SELECT "conversationId" FROM "Participants" WHERE "Participants"."userId" = 6)`)}
      },
      limit, offset,
      include: [{
        model: db.Participant,
        as: 'Participants',
        include: [
          {
            model: db.User,
            as: 'user'
          },
        ]
      }]
    })





    const response = getPagingData(data, page, limit);


    // res.status(200).send(users[0].Conversations);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message})
  }

};

exports.getConversationById = async (req, res) => {

  const {page, size} = req.query;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({error: ERR_VALIDATION, error_type: "ERR_VALIDATION", error_content: errors.array()});
  }
  try {
    const response = await db.Conversation.findAll({
      where: {
        id: req.params.conversationId
      },
      include: [{
        model: db.Participant,
        include: [
          {
            model: db.User,
            as: 'user'
          },
        ]
      }, {
        model: db.Message,
        include: [{
          model: db.Attachment
        }]
      },]
    })
    res.status(200).send(response)

  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message})
  }


};

exports.editPhoto = async (req, res) => {
  const file = req.file;
  try {
    const conversation = await db.Conversation.findOne({
      where: {
        id: req.params.conversationId
      }
    })
    conversation.photo = `uploads/${file.filename}`
    await conversation.save()
    res.status(200).send(conversation)
  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message});
  }
};

exports.searchConversations = async (req, res) => {
  try {
    console.log(req.body.query);
    const response = await db.Conversation.findAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: '%' + req.body.query + '%'
            }
          },
          {
            "$Participants.user.firstName$": {[Op.like]: req.body.query}
          }
        ]
      },
      include: [{
        model: db.Participant,
        as: 'Participants',
        include: [
          {
            model: db.User,
            as: 'user'
          },
        ]
      }]
    })

    res.status(200).send(response)
  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message});
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await db.Conversation.findOne({
      subQuery: false,
      where: {
        [Op.and]: [
          {
            id: req.body.conversationId
          },
          {
            "$Participants.userId$": req.userId
          }
        ]
      },
      include: [{
        model: db.Participant,
        as: 'Participants',
        include: [
          {
            model: db.User,
            as: 'user'
          },
        ]
      }]
    })
    if (conversation) {
      const deleted_conversation = await db.Deleted_Conversations.findOrCreate({
        where: {
          userId: req.userId,
          conversationId: req.body.conversationId
        },
        defaults: {
          conversationId: req.body.conversationId,
          userId: req.userId,
        }
      })
      res.status(200).send(deleted_conversation);
    } else {
      res.status(404).send({
        error: ERR_CONVERSATION_NOT_FOUND,
        error_type: "ERR_CONVERSATION_NOT_FOUND",
        error_content: ''
      })
    }


  } catch (error) {
    res.status(500).send({error: ERR_SERVER_ERROR, error_type: "ERR_SERVER_ERROR", error_content: error.message});
  }
};

