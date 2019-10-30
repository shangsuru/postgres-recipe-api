const express = require('express')
const auth = require('../middleware/auth')
const pool = require('../db/connection')
const router = new express.Router()

// get all recipes for given query
router.get('/', auth, (request, response) => {
  const query = request.query.q
  const offset = (request.query.page - 1) * 15
  pool.query(
    'select recipe_name, rating, recipe_img, prep_time from recipes where lower(recipe_name) like lower($1) limit 15 offset $2',
    ['%' + query + '%', offset],
    (error, results) => {
      if (error) {
        response.status(400).send()
      } else {
        response.status(200).json(results.rows)
      }
    }
  )
})

// get recipe detail
router.get('/:title', auth, (request, response) => {
  const title = request.params.title
  pool.query(
    'select * from recipes where recipe_name = $1',
    [title],
    (error, results) => {
      if (error) {
        response.status(400).send()
      } else {
        let recipe = results.rows[0]
        pool.query(
          'select ingredient from ingredients where recipe_name = $1',
          [title],
          (error, results) => {
            if (error) {
              response.status(400).send()
            } else {
              let ingredientsList = []
              results.rows.forEach(e => ingredientsList.push(e.ingredient))
              recipe['ingredients'] = ingredientsList
              response.status(200).json(recipe)
            }
          }
        )
      }
    }
  )
})

// get recipes per category
router.get('/category/:category', auth, (request, response) => {
  const category = request.params.category
  const offset = (request.query.page - 1) * 15
  pool.query(
    'select recipe_name, rating, recipe_img, prep_time from recipes where category = $1 limit 15 offset $2',
    [category, offset],
    (error, results) => {
      if (error) {
        response.status(400).send()
      } else {
        response.status(200).json(results.rows)
      }
    }
  )
})

// add a recipe
router.post('/', auth, (request, response) => {
  const {
    recipe_name,
    instructions,
    author,
    prep_time,
    ingredients,
    category,
    recipe_img
  } = request.body
  pool.query(
    'insert into recipes (recipe_name, instructions, recipe_img, author, prep_time, category) values ($1, $2, $3, $4, $5, $6)',
    [recipe_name, instructions, recipe_img, author, prep_time, category],
    (error, results) => {
      if (error) {
        response.status(400).send()
      } else {
        for (let i = 0; i < ingredients.length; i++) {
          pool.query(
            'insert into ingredients values ($1, $2)',
            [recipe_name, ingredients[i]],
            (error, results) => {
              if (error) {
                response.status(400).send()
              }
            }
          )
        }

        response.status(201).send(`recipe added`)
      }
    }
  )
})

module.exports = router
