const UsersService=require('../services/userService');

const createUserController=(req,res)=>{
    UsersService.registerController(req,res);
}

const userLoginController=(req,res)=>{
     UsersService.loginController(req,res);
}

const getUserController = (req,res)=>{
    UsersService.fetchUsersController(req,res);
}


module.exports={createUserController,userLoginController,getUserController};

