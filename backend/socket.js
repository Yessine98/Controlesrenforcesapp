// socket.js
const { Server } = require("socket.io");
let onlineUsers = {}; // Store online users with their IDs and socket IDs
let io; // Declare io variable

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Replace with your frontend URL
      methods: ["GET", "POST"], // Allowed methods
      credentials: true, // Allow credentials (cookies)
    },
  });
  console.log("Socket.js is being executed"); // Initialize socket.io with the server

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("registerUser", (userId) => {
      onlineUsers[userId] = socket.id; // Register user with their socket ID
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
      console.log("Current online users:", onlineUsers);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Remove the user from onlineUsers on disconnect
      for (const id in onlineUsers) {
        if (onlineUsers[id] === socket.id) {
          delete onlineUsers[id];
          console.log(`User unregistered: ${id}`);
          break;
        }
      }
    });
  });
};

const getSocketInstance = () => io;

const getOnlineUsers = () => {
  return onlineUsers; // Return the online users object
};

module.exports = { initSocket, getOnlineUsers, getSocketInstance };
