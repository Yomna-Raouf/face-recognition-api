const express = require("express");
const bodeyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodeyParser.json());

const database = {
  users: [
    {
      id: "123",
      name: "Yomna",
      email: "yomna@gmail.com",
      password: "password",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "sama",
      email: "sama@gmail.com",
      password: "secret",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "yomna@gmail.com",
    },
  ],
};

// Routes

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.map((user) => {
    if (user.id === id) {
      found = true;
      res.json(user);
    } /* else {
      res.status(404).json("no such user");
    } */
  });

  if (!found) res.status(400).json("not found");
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.map((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    } /* else {
      res.status(404).json("no such user");
    } */
  });

  if (!found) res.status(400).json("not found");
});

/* // Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
  // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
  // res = false
}); */

/*

 / --> res = this is working 
 /signin --> Post = success/fail 
 /register --> Post = user
 /profile/:userid --> GET = user 
 /image --> PUT --> user 

*/

app.listen(4000, () => console.log("app is running on port 4000"));
