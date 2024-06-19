const express = require("express");
const { protect } = require("../app/middlewares/auth");
const {
  AccessChatController, fetchChatControllers, fetchgroupChatController, creategroupChatController, groupExitChatController,AddSelftogroupChatController
} = require("../app/controllers/chatsControllers");
//const { accessChat } = require("../app/services/chats");

const Router = express.Router();

Router.route("/").post(protect, AccessChatController);
Router.route("/").get(protect, fetchChatControllers);
Router.route("/createGroup").post(protect, creategroupChatController);
Router.route("/fetchGroup").get(protect, fetchgroupChatController);
Router.route("/groupExit").put(protect, groupExitChatController);
Router.route("/addSelfToGroup").put(protect,AddSelftogroupChatController);
module.exports = Router;



