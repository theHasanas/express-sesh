const express = require("express");
const path = require("path");
const logger = require("morgan");
const ip = require("ip");
const db = require("./db/models");

// importing routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middleware/passport");

// init app
const app = express();

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// start server
const runApp = async () => {
  try {
    await db.sequelize.sync({ alter: true });

    app.listen(process.env.PORT, () => {
      console.log("Express app started succeffully");
      console.log(`Running on ${ip.address()}:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

runApp();

module.exports = app;
