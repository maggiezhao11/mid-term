/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

// create GET route for MY Resources
const myResources = (db) => {
  router.get("/:user_id", (req, res) => {
    db.query(`SELECT * FROM resources WHERE resources.owner_id = $1`, [req.params.user_id]) // the name after params is the same one after the /:
      .then(data => {
        const myResources = data.rows;
        console.log("data.rows:++++++++", data.rows);
        const templateVars = {resources: myResources}
        db.query(`SELECT * FROM user_likes JOIN resources ON resources.id = user_likes.resource_id WHERE user_likes.owner_id = $1`, [req.params.user_id])
      .then(result => {
        console.log("result:----------", result.rows);
        templateVars.user_likes = result.rows
        res.render("my-resources", templateVars);//it should be able to render the same page of "resources" but use filter function to the list.

        })
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
