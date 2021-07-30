const express = require('express');
const router = express.Router();


const resourceRouter = (db) => {
  router.get('/', (req, res) => {
    const user = req.cookies.user_id
    db.query(`
    SELECT resources.id,name, topic, title,  description, url FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    GROUP BY name, topic, title, description, url, resources.id;
    `)
    .then(queryResult => {
      const data = queryResult.rows
      const templateVars = {data, user}
      res.render('resources.ejs', templateVars)
    })
    .catch(err => {console.log(err.message)})
  })
  // create new url
  router.get('/new', (req, res) => {
    const user = req.cookies.user_id
    res.render('newResource', {user});
  })


// this query extract a specific resource where id is specified;
  router.get('/:id', (req, res) => {
    db.query(`SELECT resources.id,  name, topic, title,  description, url, comment, avg(rating) AS rating FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN resource_comments ON resource_comments.resource_id = resources.id
    LEFT JOIN resource_rates ON resource_rates.resource_id = resources.id
    WHERE resources.id = $1
    GROUP BY name, topic, title, description, url, resource_comments.comment, resources.id
    ;`, [req.params.id])
    .then(queryResult => {
      const data = queryResult.rows
      console.log("===============",data)
      const templateVars = {data}
      res.render('resourcesId.ejs', templateVars)
    })
    .catch(err => {console.log(err.message)})
  })


//create post route for resources/new
  router.post('/new', (req, res) => {
    console.log("anything")
    const arr = []

    db.query(`INSERT INTO categories (topic) VALUES ($1) RETURNING id`, [req.body.category]).then((results) => {
      const title = req.body.title;
      const url = req.body.url;
      const description = req.body.description;
      arr.push(title, url, description)
      console.log(arr)

      const category_id = results.rows[0].id
      console.log(category_id);
      arr.push(category_id)
      const user_id = req.cookies.user_id;
      arr.push(user_id)
      console.log("arrrrrrrrrrr: ",arr)
      db.query(`INSERT INTO resources  (title, url, description, category_id, owner_id) VALUES ($1, $2, $3, $4, $5)`, arr);

    })


    res.redirect('/api/resources')
  })

  router.post('/:id', (req, res) => {
    const user_id = req.cookies.user_id
    const resource_id = req.params.id;
    const comment = req.body.comment;
    db.query(`INSERT INTO resource_comments (resource_id, comment, owner_id) values ($1, $2, $3) RETURNING *`, [resource_id, comment, user_id])
    res.redirect(`/resources/${resource_id}`)
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
  return router
};


module.exports = resourceRouter;
