/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// create GET route for MY Resources
const myResources = (db) => {
  router.get("/", (req, res) => {
    // ***"/:id" we only need to put :id in the routes path for params not for cookies
    const userID = req.cookies.user_id;
    db.query(`SELECT * FROM resources WHERE resources.owner_id = $1`, [userID]) // the name after params is the same one after the /:
      .then((data) => {
        const myResources = data.rows;
        // console.log("data.rows:++++++++", data.rows);
        const templateVars = { resources: myResources };
        db.query(
          // `SELECT * FROM resources JOIN user_likes ON resources.id=user_likes.resource_id WHERE user_likes.owner_id = $1;`, ==> original way to deal with, because we did duplication before, so incase could be show in just one result, make them group by. ==> after setting checking exist condition in like function, don't need this group by afterwards.
          `SELECT user_likes.resource_id, user_likes.owner_id, title, url, description, category_id, resources.id  FROM user_likes JOIN resources ON resources.id=user_likes.resource_id WHERE user_likes.owner_id = $1
          GROUP BY user_likes.resource_id, user_likes.owner_id, resources.title, resources.url, resources.description, resources.category_id, resources.id;`,
          [userID])
        .then((result) => {
          //console.log("result:----------", result.rows);
          templateVars.user_likes = result.rows;
          console.log("templateVars", templateVars);
          db.query(`SELECT * FROM users WHERE id = $1`, [userID])
        .then(
            (userInfo) => {
              templateVars.user = userInfo.rows[0];
              res.render("my-resources", templateVars); //it should be able to render the same page of "resources" but use filter function to the list.
            }
          );
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = myResources;
