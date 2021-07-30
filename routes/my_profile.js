/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

// create GET route for MY profile
const myProfile = (db) => {
  router.get("/", (req, res) => {
    const userID = req.cookies.user_id;
    console.log("userID************:", userID);
    db.query(`SELECT * FROM users WHERE id = $1;`, [userID])
      .then(data =>  {
        const user = data.rows[0];
        //console.log("data.rows++++++: ", user);
        res.render("profile", {user: user})
       })
       .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  })

  router.post("/:user_id", (req, res) => {
    const userID = req.cookies.user_id;
    const newName = req.body.name;
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    //const templateVars = {name: newName, email: newEmail, password: newPassword};==>we don't need it at this time.
    db.query(`UPDATE users
    SET name = $1, email = $2, password = $3
    WHERE users.id = $4
    RETURNING *;`, [newName, newEmail, newPassword, userID])
      .then(data =>  {
        const user = data.rows[0];
        console.log("data.rows++++++: ", user);
       // res.redirect(`/api/profile/${userID}`) ==> another way to fetch the data after making changes!
        res.render("profile", {user: user});
       })
       .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  })

  return router;
};

module.exports = myProfile;
