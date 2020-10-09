const express = require("express");
const bodeyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
var knex = require("knex");
require("dotenv").config();
const port = process.env.PORT || 4000;

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// API

// -App config
const app = express();

// -Middlewares
app.use(cors());
app.use(bodeyParser.json());

// DB
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
});

// -API Routes

app.get("/", (req, res) => res.send(res.send(db.users)));

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) =>  image.handleApiCall(req, res));

// - Listen command
app.listen(port, () => console.log(`app is running on port ${port}`));
