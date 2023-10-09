/**
 * Berfungsi untuk mengirimkan cookies yang diperlukan dalam hal ini data user
 */
const LocalStrategy = require("passport-local");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        done(null, false);
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          done(null, user);
        } else {
          done(null, false);
        }
      }
    } catch (err) {
      done(err, null);
    }
  })
);

