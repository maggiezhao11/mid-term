/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const myResources = (db) => {
  router.get("/my-resources", (req, res) => {
    db.query(`SELECT * FROM resources JOIN user_likes ON owner_id = user_likes.user_id WHERE owner.id = $1`, [req.params.user_id]) // need to console.log the incoming data to finalize the variable name
      .then(data => {
        const users = data.rows;
        res.render("my-resources");//it should be able to render the same page of "resources" but use filter function to the list.
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

module.exports = myResources;
