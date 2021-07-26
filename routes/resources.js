const express = require('express');
const router = express.Router();


const resourceRouter = (db) => {
  router.get('/', (req, res) => {
    db.query(`
    SELECT name, topic, title,  description, url FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    GROUP BY name, topic, title, description, url;
    `)
    .then(queryResult => {
      const data = queryResult.rows
      const templateVars = {data}
      res.render('resources.ejs', templateVars)
    })
    .catch(err => {console.log(err.message)})
  })
  // create new url
  router.get('/new', (req, res) => {
    res.render('newResource');
  })


// this require the a specific resource where id is specified;
  router.get('/:id', (req, res) => {
    db.query(`SELECT name, topic, title,  description, url FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    WHERE resources.id = $1
    GROUP BY name, topic, title, description, url;`, [req.params.id])
    .then(queryResult => {
      const data = queryResult.rows
      const templateVars = {data}
      res.render('resources.ejs', templateVars)
    })
    .catch(err => {console.log(err.message)})
  })

  router.post('/new', (req, res) => {
    const arr = []

    db.query(`INSERT INTO categories (topic) VALUES ($1) RETURNING id`, [req.body.category], (err, results) => {
      const title = req.body.title;
      const url = req.body.url;
      const description = req.body.description;
      arr.push(title, url, description)
      console.log(arr)

      const category_id = results.rows[0].id
      console.log(category_id);
      arr.push(category_id)
      db.query(`INSERT INTO resources  (title, url, description, category_id) VALUES ($1, $2, $3, $4)`, arr);

    })


    res.redirect('/resources')
  })



  return router
};


module.exports = resourceRouter;