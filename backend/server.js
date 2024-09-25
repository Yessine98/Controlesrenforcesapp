const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const db = require("./models");

const userRoutes = require("./routes/userRoutes");
const aqRoutes= require('./routes/aqRoutes')
const cqRoutes = require('./routes/cqRoutes')
const notificationRoutes = require('./routes/notificationRoutes');



app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quality Control Management System." });
});

app.use("/api/user", userRoutes);
app.use("/api/aq",aqRoutes);
app.use("/api/cq",cqRoutes);
app.use('/api/notifications', notificationRoutes);



db.sequelize.sync().then(() => {
    console.log("Drop and Resync Db");
  }).catch((err) => {
    console.log('Error: ' + err)});
  
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });


