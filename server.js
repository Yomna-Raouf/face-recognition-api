const express = require("express");
const bodeyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
var knex = require("knex");
require("dotenv").config();
const port = process.env.PORT || 4000;

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

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid)
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));

      return res.status(400).json("wrong credentials");
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into("login")
      .returning("email")
      .then((LoginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: LoginEmail[0],
            joined: new Date(),
          })
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) return res.json(user[0]);
      return res.status(400).json("Not Found");
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch((err) => res.status(400).json("unable to get entries"));
});

// - Listen command
app.listen(port, () => console.log(`app is running on port ${port}`));
