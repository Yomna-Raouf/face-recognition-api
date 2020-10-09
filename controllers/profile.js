const handleProfileGet = (req, res, db) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) return res.json(user[0]);
      return res.status(400).json("Not Found");
    })
    .catch((err) => res.status(400).json("error getting user"));
};

module.exports = {
  handleProfileGet: handleProfileGet,
};