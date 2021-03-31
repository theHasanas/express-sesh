const express = require("express");
const passport = require("passport");
const { register, login, addUser } = require("../controllers/users");

const router = express.Router();

// authentication
router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

// contacts
router.put(
  "/add/:userId",
  passport.authenticate("jwt", { session: false }),
  addUser
);

module.exports = router;
