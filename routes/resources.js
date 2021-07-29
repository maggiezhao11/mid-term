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
    db.query(`SELECT name, topic, title,  description, url, ARRAY_AGG(resource_comments.comment) AS comments, AVG(resource_rates.rating) AS rating FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN resource_comments ON resources.id = resource_comments.resource_id
    LEFT JOIN resource_rates ON resources.id = resource_rates.resource_id
    WHERE resources.id = $1
    GROUP BY name, topic, title, description, url;`, [req.params.id])
    .then(queryResult => {
      const data = queryResult.rows
      const templateVars = {data}
      console.log("data:", data)
      res.render('resource_show.ejs', templateVars)
    })
    .catch(err => {console.log(err.message)})

  })
  router.get('/:id/comment', (req, res) => {
    //return comment / name / category
    const resourceID = req.params.id;
    db.query(`
    SELECT name, topic, resource_comments.comment AS comments FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN resource_comments ON resources.id = resource_comments.resource_id
    WHERE resources.id = $1;
    ;`, [resourceID])
    .then(queryResult => {
      const data = queryResult.rows
      const templateVars = {data}
      //console.log("data:", data)
      // res.render('resource_show.ejs', templateVars)
      res.json(data);
    })
    .catch(err => {console.log(err.message)})
  });

  router.post('/:id/rate', (req, res) => {
    console.log("rate path");
    //return resource details
    const userID = req.cookies.user_id;
    const resourceID = req.params.id;
    const rating = req.body.rating;
    db.query(`
    INSERT INTO resource_rates (resource_id, owner_id, rating)
    VALUEs ($1, $2, $3)
    RETURNING *;`, [resourceID, userID, rating])
    .then(queryResult => {
      const data = queryResult.rows
      res.json(data);
    })
    .catch(err => {console.log(err.message)})
  });


  router.post('/:id/like', (req, res) => {
    console.log("like path");
    //return resource details
    const userID = req.cookies.user_id;
    const resourceID = req.params.id;
    db.query(`
    INSERT INTO user_likes (resource_id, owner_id)
    VALUEs ($1, $2)
    RETURNING *;`, [resourceID, userID])
    .then(queryResult => {
      const data = queryResult.rows
      res.json(data);
    })
    .catch(err => {console.log(err.message)})
  });

  router.post('/fetch/:id', (req, res) => {
    const userID = req.cookies.user_id;
    const resourceID = req.params.id;
    const comment = req.body.comment;
    db.query(`INSERT INTO resource_comments (resource_id, owner_id, comment)
    VALUEs ($1, $2, $3)
    ;`, [resourceID, userID, comment])
    .then(queryResult => {
      const data = queryResult.rows
      const templateVars = {data}
      console.log("data:", data)
      // res.render('resource_show.ejs', templateVars)
      res.json("successfully loaded");
    })
    .catch(err => {console.log(err.message)})

  })



  router.get('/fetch/:id', (req, res) => {
    console.log("after line 31");
    db.query(`SELECT name, topic, title,  description, url, ARRAY_AGG(resource_comments.comment) AS comments, AVG(resource_rates.rating) AS rating FROM resources
    JOIN users on resources.owner_id = users.id
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN resource_comments ON resources.id = resource_comments.resource_id
    LEFT JOIN resource_rates ON resources.id = resource_rates.resource_id
    WHERE resources.id = $1
    GROUP BY name, topic, title, description, url;`, [req.params.id])
    .then(queryResult => {
      const data = queryResult.rows
      // const templateVars = {data}
      // res.render('resources.ejs', templateVars)
      console.log("data:", data)
      // return res.status(200).send(data);
      return res.json(data);
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
