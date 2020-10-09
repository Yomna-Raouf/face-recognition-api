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
    host: "127.0.0.1",
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB}`,
  },
});

// -API Routes
// res.send(db.users))
app.get("/", (req, res) => res.send("Helloooooo"));

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) =>  image.handleApiCall(req, res));

// - Listen command
app.listen(port, () => console.log(`app is running on port ${port}`));
