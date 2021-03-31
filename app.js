const express = require("express");
const path = require("path");
const logger = require("morgan");
const { networkInterfaces } = require("os");
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
    const nets = networkInterfaces();
    const results = Object.create(null);

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === "IPv4" && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }

    await db.sequelize.sync({ alter: true });

    app.listen(8000, () => {
      console.log("Express app started succeffully");
      console.log(`Running on ${results["en0"][0]}:8000`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

runApp();

module.exports = app;
