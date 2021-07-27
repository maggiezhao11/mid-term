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
    res.render("register");
  });

  router.post("/", (req, res) => {
    const body = req.body;

    db.query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) RETURNING *;`, [body.name, body.email, body.password])
      .then(data => {
        res.cookie("user_id", data.rows[0].id);
        res.redirect("/api");

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
