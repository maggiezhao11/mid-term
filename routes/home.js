/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

    if(!req.cookies["user_id"]) {
      res.redirect("/api/login");
      return;
    }

    db.query(`SELECT * FROM users WHERE id = $1;`, [req.cookies["user_id"]])
      .then(data => {
        const users = data.rows;
        const templateVars = { user: data.rows[0].email };
        res.render("home", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.post("/", (req, res) => {
    console.log("$$$$$$$$$", req.body);
    const body = req.body;

    db.query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) RETURNING *;`, [body.name, body.email, body.password])
      .then(data => {
        res.cookie("user_id", data.rows[0].id);
        res.json({ user: body });

      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  return router;
};
