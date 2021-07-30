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
    db.query(`SELECT * FROM users WHERE id = $1;`, [req.cookies["user_id"]])
      .then(result => {
        const templateVars = { user: result.rows[0] };
        res.render("topic_search", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    //res.render("title_search");
  });

  router.post("/", (req, res) => {
    const body = req.body;

    db.query(`SELECT resources.*, categories.topic FROM resources JOIN categories
    ON category_id=categories.id
    WHERE topic = $1;`, [body.topic])
      .then(data => {
        const resources = data.rows;
        //const templateVars = {resources: resources};
        // res.render("titles", templateVars);


        db.query(`SELECT * FROM users WHERE id = $1;`, [req.cookies["user_id"]])
      .then(result => {
        const templateVars = { resources: resources, user: result.rows[0] };
        res.render("topics", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
        // if(data.rows[0].password === body.password) {
        //   res.cookie("user_id", data.rows[0].id);
        //   res.redirect("/api");
        // } else {
        //   res
        //   .status(401)
        //   .json({ error: "incorrect password" });
        // }

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
