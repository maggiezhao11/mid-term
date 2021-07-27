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
    console.log("register-----");
    res.render("register");
  });

  router.post("/", (req, res) => {
    console.log("$$$$$$$$$", req.body);
    const body = req.body;

    db.query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) RETURNING *;`, [body.name, body.email, body.password])
      .then(data => {
        // user = db.query(`SELECT id FROM users;` ).then(data => {
        //   console.log("id", data.rows[data.rows.length-1]);
        // })
        res.cookie("user_id", data.rows[0].id);
        res.json({ user: body });

        //console.log("id", data.rows[0].id);

//if(req.cookies["user_id"])
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/change-password", (req, res) => {
    console.log("change-passhword+++++++");
    res.render("index");
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};
