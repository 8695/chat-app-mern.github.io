const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const generateToken = require("../config/genrateToken");

//@desc login a user
//@route POST user/login
//@access public
const loginController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // check for all fields
  if (!username || !password) {
    return res.status(400).send({success:400,message:"All filed are mandatory"});
  }

  //find user with username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(402).send({status:402,message:"Invalid username"});
  }
  const result = await bcrypt.compare(password, user.password);
  console.log("result",result);
  if (result) {
    res.status(201).send({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id,user.username),
    });
  } else {
    return res.status(404).send({status:404,message:"Invalid password"});
  }
});

//@desc Register a user
//@route POST /user/register
//@access public
const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  console.log("name",username);
  console.log("email",email)

  //check for all fields
  if (!username || !email || !password) {
    return res.status(400).send({status:400,message:"all field are mandatory"});
    
  }

  //check for pre-existing user
  const userExist = await User.find({email});
  console.log("user",userExist)
  if (userExist) {
    return res.status(406).send({status:false,message:"Email is already taken"});
  }

  //check for existing username
  const userNameExist = await User.findOne({ username });
  if (userNameExist) {
     return res.status(406).send({status:406,message:"Username already taken"});
    
  }

  //hashing password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  // create an entry in the db
  const user = await User.create({ username, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
     return res.status(400).send({status:400,meassge:"Registration Error"});
    
  }
});

//@desc Register a user
//@route POST /user/register
//@access public
const fetchUsersController = asyncHandler(async (req, res) => {
  console.log(req.query.keyword);
  const keyword = req.query.search
    ? {
        $or: [
          {
            username: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
 return  res.send(users);
});
module.exports = { loginController, registerController, fetchUsersController };
