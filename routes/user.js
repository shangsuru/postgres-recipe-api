const express = require('express')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const pool = require('../db/connection')
require('dotenv').config()

// create account
router.post('/signup', async (request, response) => {
  const username = request.body.username
  const password = request.body.password
  const hashedPassword = bcrypt.hashSync(password, 8)
  pool.query(
    'insert into users values ($1, $2)',
    [username, hashedPassword],
    (error, results) => {
      const token = jwt.sign({ username }, process.env.JWT_SECRET)
      response.status(201).send({ username, token })
    }
  )
})

// authenticate user
router.post('/login', async (request, response) => {
  // fetch user
  pool.query(
    'select * from users where username=$1',
    [request.body.username],
    (error, results) => {
      try {
        if (results.rows.length === 0) {
          throw error
        }
        const { username, userpassword } = results.rows[0]
        // check password
        let correctPassword = bcrypt.compareSync(
          request.body.userpassword,
          userpassword
        )
        if (!correctPassword) {
          throw error
        }
        // generate auth token
        const token = jwt.sign({ username }, process.env.JWT_SECRET)
        response.status(201).send({ username, token })
      } catch (e) {
        response.status(400).send()
      }
    }
  )
})

// fetch recipes that the user created
router.get('/recipes', auth, async (request, response) => {
  pool.query(
    'select recipe_name, rating, recipe_img, prep_time from recipes where author=$1',
    [request.username],
    (error, results) => {
      if (error) {
        console.log(error)
      } else {
        response.status(200).json(results.rows)
      }
    }
  )
})

// fetch recipes the user has liked
router.get('/favorites', auth, async (request, response) => {
  pool.query(
    'select recipe_name, rating, recipe_img, prep_time from recipes where recipe_name in (select recipe from favorites where username=$1)',
    [request.username],
    (error, results) => {
      if (error) {
        console.log(error)
      } else {
        response.status(200).json(results.rows)
      }
    }
  )
})

module.exports = router
