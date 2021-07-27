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
// create GET route for resource edit
  router.get('/:id/edit' , (req, res) => {
    db.query(`SELECT resources.id, name, topic, title,  description, url FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    WHERE resources.id = $1
    GROUP BY resources.id, name, topic, title, description, url;`, [req.params.id])
    .then(queryResult => {
    const data = queryResult.rows[0]
    //const templateVars = {...data} ==> how to store everything from data to templateVars
    //console.log("templateVars:", templateVars);
    res.render('edit-resource', data)
    })
    .catch(err => {console.log(err.message)})
  })

<<<<<<< HEAD
=======
// create POST route for resource edit
router.post('/:id/edit' , (req, res) => {
  const newTitle = req.body.title
  const newURL = req.body.url
  const newDescription = req.body.description
  const resourceId = req.params.id
  const templateVars = {id: resourceId, title: newTitle, url: newURL, description: newDescription}
  db.query(`UPDATE resources
  SET title = $2, url = $3,  description = $4
  WHERE resources.id = $1
  RETURNING *;`, [resourceId, newTitle, newURL, newDescription])
  .then(() => {
    db.query(`SELECT resources.id, name, topic, title,  description, url FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    WHERE resources.id = $1
    GROUP BY resources.id, name, topic, title, description, url;`, [resourceId])
    .then((queryResult) => {
      const data = queryResult.rows[0]
      console.log("templateVars++++++++++++:", templateVars);
      console.log("data++++++++++++:", data);
      res.render('edit-resource', data)
    })
  })
  .catch(err => {console.log(err.message)})
})

>>>>>>> midtermmaggiework

  return router
};


module.exports = resourceRouter;
