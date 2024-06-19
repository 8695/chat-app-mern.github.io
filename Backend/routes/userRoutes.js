const express = require("express");
const Router = express.Router();
const {
  createUserController,
  userLoginController,
  getUserController,
} = require("../app/controllers/usersController");
const { protect } = require("../app/middlewares/auth");

Router.route("/register").post(createUserController);
Router.route("/login").post(userLoginController);
Router.route("/fetchUsers").get(protect, getUserController);

module.exports = Router;