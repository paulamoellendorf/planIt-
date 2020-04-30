require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const bcrypt = require("bcrypt");
const session = require("express-session");

// require passport and the local strategy
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo")(session);

// require Models
const User = require("./models/User.js");
const Family = require("./models/Family.js");
const Goal =require("./models/Goal.js");

mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost/planit", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000,
    }),
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Family.findById(id)
    .then((dbFamily) => {
      done(null, dbFamily);
    })
    .catch((err) => {
      done(err);
    });
});

// require connect flash for the messages
const flash = require("connect-flash");

// Register connect-flash middleware
app.use(flash());
passport.use(
  new LocalStrategy((username, password, done) => {
    Family.findOne({ username: username })
      .then((found) => {
        if (found === null) {
          done(null, false, { message: "Wrong credentials" });
        } else if (!bcrypt.compareSync(password, found.password)) {
          done(null, false, { message: "Wrong credentials" });
        } else {
          done(null, found);
        }
      })
      .catch((err) => {
        done(err, false);
      });
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "PlanIt!";


const index = require('./routes/index');
app.use('/', index);
const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);
const goalsRoutes=require('./routes/goals');
app.use('/', goalsRoutes);

const member = require('./routes/member');
app.use('/', member);

const private = require('./routes/private');
app.use('/', private);



module.exports = app;