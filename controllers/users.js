const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

const REQUESTED = "requested";
const ACCEPTED = "accepted";

const include = {
  include: [
    {
      model: User,
      as: "contacts",
      attributes: ["id"],
      through: {
        as: "request",
        attributes: ["status"],
      },
    },
  ],
};

exports.register = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("register -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;
    await User.create(req.body);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.login = (req, res, next) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      exp: Date.now() + 90000000,
    };

    const token = jwt.sign(JSON.stringify(payload), "asupersecretkey");
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const addedUser = await User.findByPk(req.params.userId, include);

    const addedUserContact = addedUser.contacts.find(
      (contact) => contact.id === req.user.id
    );

    if (addedUserContact) {
      // accept request

      const request = addedUserContact.request;
      if (request.status === REQUESTED) {
        addedUser.addContact(req.user, {
          through: { status: ACCEPTED },
        });

        res.send("You are now friends");
      }
    } else {
      // make new request

      if (addedUser.id) {
        await req.user.addContact(addedUser, {
          through: { status: REQUESTED },
        });
      }

      res.send("Added user, awaiting response");
    }
  } catch (error) {
    next(error);
  }
};
