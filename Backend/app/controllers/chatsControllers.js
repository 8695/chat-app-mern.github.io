const chatService = require('../services/chats');

const AccessChatController = (req, res) => {
    chatService.accessChat(req, res);
}

const fetchChatControllers = (req, res) => {
    chatService.fetchChat(req, res);
}

const fetchgroupChatController = (req, res) => {
    chatService.fetchGroup(req, res);
}
const creategroupChatController = (req, res) => {
    chatService.createGroupChat(req, res);
}
const groupExitChatController = (req, res) => {
    chatService.groupExit(req, res);
}
const AddSelftogroupChatController = (req, res) => {
    chatService.addSelfToGroup(req, res);
}

module.exports = { AccessChatController, fetchChatControllers, fetchgroupChatController, creategroupChatController, groupExitChatController,AddSelftogroupChatController};
