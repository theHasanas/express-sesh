const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

const { User, UserUsers } = require("../db/models");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      where: { username },
    });

    const passwordsMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordsMatch) {
      return done(null, user);
    }

    return done(null, false);
  } catch (error) {
    done(error);
  }
});

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: "asupersecretkey",
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false);
    }
    try {
      const user = await User.findByPk(jwtPayload.id, {
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
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
