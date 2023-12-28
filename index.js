// Import required modules and setup
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const local = require("./src/middlewares/local");
const sequelize = require("./src/database/connection");
const store = new session.MemoryStore();
const todoRoutes = require("./src/router/router");
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: "*", // Replace with the actual allowed origins
  Credentials: true,
  optionsSuccessStatus: 200,
};

// Sync the database and start the server
sequelize
  .sync()
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

const port = process.env.PORT || 3333;
const app = express();

app.use(cookieParser());

// Configure session management
app.use(
  session({
    secret: "secret", // Replace with a secure secret key
    resave: false,
    cookie: {
      maxAge: 6000000000, // Replace with an appropriate session duration
    },
    saveUninitialized: false,
    store,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use(cors(corsOptions));

// Configure body parsers
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Define a root route
app.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send("Not logged in");
  }
});



// Define routes
app.use("/bca-app", todoRoutes);

// Start the server
app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
