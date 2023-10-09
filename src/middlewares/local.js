const LocalStrategy = require("passport-local");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Serialize the user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Deserialize the user from the session
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

// Configure the LocalStrategy for authenticating users
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        // User not found
        done(null, false);
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          // Authentication successful
          done(null, user);
        } else {
          // Incorrect password
          done(null, false);
        }
      }
    } catch (err) {
      done(err, null);
    }
  })
);

module.exports = passport;
