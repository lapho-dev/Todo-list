const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
const { loggerMiddileware } = require('./logger/logger');
const {PORT, CLIENT_URL} = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./middlewares/passport-middleware')

// Middleware // 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// Middleware to log requests and responses
app.use(loggerMiddileware);


// Routes //
// Import Routes
const routeAuth = require('./routes/auth-route');
const routeNotes = require('./routes/notes-route');
const defaultRoute = require('./routes/default-route');

// Initialize routes
app.use('/', defaultRoute);
app.use('/api', routeAuth, routeNotes);


// Start server
const port = PORT || 5000;

const appStart = () => {
  try {
    app.listen(port, () => {
      console.log("Server listening on http://localhost:" + port);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
};

appStart(); 

module.exports = {app};