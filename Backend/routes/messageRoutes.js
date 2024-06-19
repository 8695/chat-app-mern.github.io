const express = require("express");
const { protect } = require("../app/middlewares/auth");
const {
    sendMessageController,allMessageController
} = require("../app/controllers/messageController");
const Router = express.Router();

Router.route("/:chatId").get(protect, allMessageController);
Router.route("/").post(protect, sendMessageController);

module.exports = Router;
