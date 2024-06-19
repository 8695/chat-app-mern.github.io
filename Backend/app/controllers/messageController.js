const chatService=require('../services/message');

const allMessageController=(req,res)=>{
    chatService.allMessages(req,res);
}

const sendMessageController =(req,res)=>{
    chatService.sendMessage(req,res);
}

module.exports={sendMessageController,allMessageController};

