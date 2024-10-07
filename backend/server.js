// server.js
const express = require("express");
require("dotenv").config();
const http = require("http");
const {initSocket} = require("./socket")
const cors = require("cors");
const db = require("./models");

const userRoutes = require("./routes/userRoutes");
const aqRoutes = require('./routes/aqRoutes');
const cqRoutes = require('./routes/cqRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Set up middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

initSocket(server);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quality Control Management System." });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/aq", aqRoutes);
app.use("/api/cq", cqRoutes);
app.use("/api/notifications", notificationRoutes);


// Sync database
db.sequelize.sync().then(() => {
  console.log("Drop and Resync Db");
}).catch((err) => {
  console.log('Error: ' + err);
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



