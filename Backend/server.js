const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./app/config/dbConnection");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
dotenv.config();

connectDb();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Ignore this, as it is only for server restart...
app.get("/restart", (req, res) => {
  try {
    res.status(200).send({ status: `server restarted` });
  } catch (error) {
    res.status(500);
    throw new Error(error?.message);
  }
});

//Middlewares
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({
    message: err.message,
    //stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
// app.use(errorHandler);
const httpServer = createServer(app);
const port = process.env.PORT || 5001;
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  // console.log("new user is connected", socket.id);
  socket.on("setup", (user) => {
    socket.join(user.data._id);
    socket.emit("connected");
    console.log("joined user", user.data._id);
  });

  socket.on("join chat", (room) => socket.join(room));
  socket.on("leave chat", (room) => {
    console.log("user left: ", room);
    socket.leave(room);
  });
  socket.on("typing", (room) => {
    console.log("typing in:", room);
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    console.log("stop typing in:", room);
    socket.to(room).emit("stop typing");
  });

  socket.on("newMessage", (newMessageStatus) => {
    // console.log("new message....");
    // console.log(newMessageStatus, "new msg...");
    var chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageStatus.sender._id) return;
      socket.in(user._id).emit("message received", newMessageStatus);
      // console.log("message received emitted...");
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected!");
    socket.leave(user.data._id);
  });
});
httpServer.listen(port, () => {
  console.log("server is running on ", port);
});
