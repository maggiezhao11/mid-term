// load .env data into process.env
require('dotenv').config();

var cookieParser = require('cookie-parser')

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
app.use(cookieParser())


// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const logoutRoutes = require("./routes/logout");

const resourceRoutes = require('./routes/resources')
const myResourcesRoutes = require("./routes/my_resources");
const myProfile = require('./routes/my_profile')

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
app.use("/api/register", registerRoutes(db));
app.use("/api/login", loginRoutes(db));
app.use("/api/logout", logoutRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));

app.use('/api/resources', resourceRoutes(db));
app.use("/api/my-resources", myResourcesRoutes(db));
app.use('/api/profile', myProfile(db));
app.use("/api/", homeRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

//this page either presents the registeration form if notregistered
//or gives error message if registered
app.get("/register", (req, res) => {
  // if (req.session.user_id) {
  //   res.redirect("/urls");
  // } else {
  //   res.render("register");
  // }
  res.render("register");
});

//this makes it possible to register if not already registered
//or else gives an appropriate message
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("urls_404");
  } else if (getUserByEmail(req.body.email, users)) {
    res.render("urls_404");
  } else {
    const id = generateRandomString();
    req.session.user_id = id;

    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = { id: id, email: req.body.email, password: hashedPassword }
    users[id] = user;

    res.redirect("/urls/");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
