const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const postDataRoutes = require("./routes/postDataRoutes");
const adminRoutes = require("./routes/admin");
const superAdminRoutes = require("./routes/superAdmin");
const userRoutes = require("./routes/user");
const databaseRoutes = require("./routes/datebase");

const SERVER_PORT = 8080;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(postDataRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/superAdmin", superAdminRoutes);
app.use("/user", userRoutes);
app.use("/db", databaseRoutes);

app.use("/", (req, res, next) => {
  res.json({ message: "hello first deployment" });
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect("mongodb+srv://ali:alihassan5@cluster0.8vsqbst.mongodb.net/db-p")
  .then(() => {
    console.log("DB Connected!!");
    app.listen(process.env.PORT || SERVER_PORT, () => {
      console.log(`Live at port ${SERVER_PORT}`);
    });
  })
  .catch((err) => console.log(err));

// mongodb+srv://ali:alihassan5@cluster0.8vsqbst.mongodb.net/sn?retryWrites=true&w=majority
