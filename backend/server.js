const express = require("express");
require("dotenv").config();
const http = require("http");
const { initSocket } = require("./socket");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./models");

const userRoutes = require("./routes/userRoutes");
const aqRoutes = require("./routes/aqRoutes");
const cqRoutes = require("./routes/cqRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const managerRoutes = require("./routes/managerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const server = http.createServer(app);

// Set up middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("combined")); // Or "dev" for less verbose output

initSocket(server);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quality Control Management System." });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/aq", aqRoutes);
app.use("/api/cq", cqRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Sync database
const syncDatabase = async () => {
  try {
    await db.sequelize.sync();
    console.log("Database synchronized.");
  } catch (err) {
    console.error("Error synchronizing database:", err);
  }
};

syncDatabase();

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
